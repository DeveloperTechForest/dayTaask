from rest_framework import serializers
from payments_app.models import Payment


class CustomerPaymentDetailSerializer(serializers.ModelSerializer):

    booking_code = serializers.CharField(source="booking.booking_code")

    class Meta:
        model = Payment
        fields = [
            "__all__"
        ]
