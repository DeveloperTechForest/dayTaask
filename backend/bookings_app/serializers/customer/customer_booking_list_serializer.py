from rest_framework import serializers
from bookings_app.models import Booking


class CustomerBookingListSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source="service.name", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_code",
            "service_name",
            "scheduled_at",
            "status",
            "payment_status",
            "total_price",
            "created_at",
        ]
