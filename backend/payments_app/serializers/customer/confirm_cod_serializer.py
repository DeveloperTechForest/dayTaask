# payments_app/serializers/customer/confirm_cod_serializer.py
from rest_framework import serializers
from django.db import transaction

from bookings_app.models import Booking
from payments_app.models import Payment


class ConfirmCODSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()

    @transaction.atomic
    def create(self, validated_data):

        request = self.context["request"]

        booking = Booking.objects.select_for_update().get(
            id=validated_data["booking_id"],
            customer=request.user
        )

        if booking.payment_status in ["paid", "cod_pending"]:
            raise serializers.ValidationError("Payment already processed.")

        # Create payment record
        Payment.objects.create(
            booking=booking,
            amount=booking.total_price,
            payment_mode="cod",
            payment_status="cod_pending"
        )

        booking.payment_status = "cod_pending"
        booking.status = "confirmed"
        booking.save()

        return booking
