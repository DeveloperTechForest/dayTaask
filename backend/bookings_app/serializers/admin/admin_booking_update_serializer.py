# bookings_app/serializers/admin/admin_booking_update_serializer.py

from rest_framework import serializers
from bookings_app.models import Booking
from bookings_app.serializers.utils.assignment_utils import recalculate_assignment_status


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

        if "required_taaskrs" in validated_data:
            recalculate_assignment_status(instance)
        return instance
