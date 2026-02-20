# bookings_app/serializers/admin/booking_list_serializer.py

from rest_framework import serializers
from bookings_app.models import Booking


class BookingAdminListSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.full_name", read_only=True
    )
    service_name = serializers.CharField(
        source="service.name", read_only=True
    )

    accepted_taaskrs = serializers.SerializerMethodField()
    is_urgent = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_code",
            "customer_name",
            "service_name",
            "scheduled_at",
            "status",
            "assignment_status",
            "required_taaskrs",
            "accepted_taaskrs",
            "is_urgent",
            "priority",
            "total_price",
            "created_at",
        ]

    def get_accepted_taaskrs(self, obj):
        return obj.assignments.filter(status="accepted").count()

    def get_is_urgent(self, obj):
        return (
            obj.assignment_status != "assigned"
            or self.get_accepted_taaskrs(obj) < obj.required_taaskrs
        )
