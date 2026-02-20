# bookings_app/serializers/admin/booking_calendar_serializer.py

from rest_framework import serializers
from bookings_app.models import Booking


class BookingCalendarSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(
        source="service.name", read_only=True
    )
    customer_name = serializers.CharField(
        source="customer.full_name", read_only=True
    )

    accepted_taaskr_count = serializers.IntegerField(read_only=True)
    is_fully_assigned = serializers.SerializerMethodField()
    urgency_level = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_code",
            "scheduled_at",
            "service_name",
            "status",
            "assignment_status",
            "customer_name",
            "priority",
            "required_taaskrs",
            "accepted_taaskr_count",
            "is_fully_assigned",
            "urgency_level",
        ]

    def get_is_fully_assigned(self, obj):
        return obj.accepted_taaskr_count >= obj.required_taaskrs

    def get_urgency_level(self, obj):
        accepted = obj.accepted_taaskr_count

        if accepted == 0:
            return "high"
        elif accepted < obj.required_taaskrs:
            return "medium"
        return "low"
