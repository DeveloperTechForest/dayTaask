# payments_app/serializers/customer/create_payment_order_serializer.py
from rest_framework import serializers
from django.db import transaction
from django.conf import settings

from bookings_app.models import Booking
from payments_app.models import Payment
from payments_app.services.razorpay_service import create_razorpay_order


class CreatePaymentOrderSerializer(serializers.Serializer):

    booking_id = serializers.IntegerField(write_only=True)

    @transaction.atomic
    def create(self, validated_data):

        request = self.context["request"]

        booking = Booking.objects.select_for_update().get(
            id=validated_data["booking_id"],
            customer=request.user
        )

        if booking.payment_status == "paid":
            raise serializers.ValidationError("Already paid.")

        # 🔒 Check for existing active payment
        existing_payment = Payment.objects.filter(
            booking=booking,
            payment_status__in=["initiated", "authorized"]
        ).first()

        if existing_payment and existing_payment.provider_order_id:
            return {
                "order_id": existing_payment.provider_order_id,
                "key": settings.RAZORPAY_KEY_ID,
                "amount": existing_payment.amount,
                "currency": "INR",
            }

        # 💰 Calculate remaining amount (supports partial payments)
        remaining_amount = booking.total_price - booking.paid_amount

        order = create_razorpay_order(
            remaining_amount,
            booking.booking_code
        )

        payment = Payment.objects.create(
            booking=booking,
            amount=remaining_amount,
            payment_mode="razorpay",
            provider_order_id=order["id"],
            payment_status="initiated"
        )

        return {
            "order_id": order["id"],
            "key": settings.RAZORPAY_KEY_ID,
            "amount": payment.amount,
            "currency": "INR",
        }
