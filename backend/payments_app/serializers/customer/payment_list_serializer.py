from rest_framework import serializers
from payments_app.models import Payment


class CustomerPaymentListSerializer(serializers.ModelSerializer):

    booking_code = serializers.CharField(source="booking.booking_code")

    class Meta:
        model = Payment
        fields = [
            "id",
            "booking_code",
            "amount",
            "payment_status",
            "payment_mode",
            "created_at",
        ]
