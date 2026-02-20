# payments_app/views/webhook.py
import hmac
import hashlib
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.conf import settings
from django.db import transaction

from payments_app.models import Payment


@csrf_exempt
def razorpay_webhook(request):

    body = request.body
    received_signature = request.headers.get("X-Razorpay-Signature")

    expected_signature = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected_signature, received_signature):
        return HttpResponse(status=400)

    payload = json.loads(body)
    event = payload.get("event")

    if event in ["payment.captured", "payment.failed"]:

        entity = payload["payload"]["payment"]["entity"]
        order_id = entity["order_id"]
        payment_id = entity.get("id")

        try:
            with transaction.atomic():

                payment = Payment.objects.select_for_update().get(
                    provider_order_id=order_id
                )

                # 🔁 Idempotency protection
                if event == "payment.captured" and payment.payment_status == "captured":
                    return HttpResponse(status=200)

                if event == "payment.captured":

                    payment.payment_status = "captured"
                    payment.provider_payment_id = payment_id
                    payment.save()

                    booking = payment.booking
                    booking.paid_amount += payment.amount

                    if booking.paid_amount >= booking.total_price:
                        booking.payment_status = "paid"
                        booking.status = "confirmed"
                    else:
                        booking.payment_status = "partial"

                    booking.save()

                elif event == "payment.failed":
                    payment.payment_status = "failed"
                    payment.save()

        except Payment.DoesNotExist:
            pass

    return HttpResponse(status=200)
