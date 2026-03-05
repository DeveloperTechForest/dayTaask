# bookings/serializers.py
from rest_framework import serializers
from bookings_app.models import Booking


class CustomerBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'id', 'booking_code', 'service_name', 'scheduled_at',
            'status', 'address', 'total_price', 'paid_amount'
        ]
        read_only_fields = fields
