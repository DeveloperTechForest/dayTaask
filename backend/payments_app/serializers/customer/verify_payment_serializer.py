# payments_app/serializers/customer/verify_payment_serializer.py
from rest_framework import serializers
from django.db import transaction

from payments_app.models import Payment
from payments_app.services.razorpay_service import verify_razorpay_signature


class VerifyPaymentSerializer(serializers.Serializer):

    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()

    @transaction.atomic
    def create(self, validated_data):

        verify_razorpay_signature(validated_data)

        payment = Payment.objects.select_for_update().get(
            provider_order_id=validated_data["razorpay_order_id"]
        )

        if payment.payment_status == "captured":
            return payment

        payment.payment_status = "authorized"
        payment.provider_payment_id = validated_data["razorpay_payment_id"]
        payment.provider_signature = validated_data["razorpay_signature"]
        payment.save()

        return payment
