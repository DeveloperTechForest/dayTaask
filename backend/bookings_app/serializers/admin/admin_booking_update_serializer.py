# bookings_app/serializers/admin/admin_booking_update_serializer.py

from rest_framework import serializers
from bookings_app.models import Booking


class AdminBookingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "service",
            "address",
            "scheduled_at",
            "priority",
            "required_taaskrs",
            "status",
            "total_price",
            "location_notes",
        ]

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()
        return instance
