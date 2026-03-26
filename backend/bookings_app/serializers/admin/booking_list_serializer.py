# bookings_app/serializers/admin/booking_list_serializer.py

from rest_framework import serializers
from django.utils import timezone
from bookings_app.models import Booking


class BookingAdminListSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.full_name", read_only=True
    )
    service_name = serializers.CharField(
        source="service.name", read_only=True
    )

    accepted_taaskrs = serializers.SerializerMethodField()
    needs_assignment = serializers.SerializerMethodField()
    is_urgent = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

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
            "needs_assignment",
            "is_urgent",
            "priority",
            "total_price",
            "created_at",
        ]

    def get_accepted_taaskrs(self, obj):
        return obj.assignments.filter(status="accepted").count()

    def get_needs_assignment(self, obj):
        return self.get_accepted_taaskrs(obj) < obj.required_taaskrs

    def get_is_urgent(self, obj):
        if not self.get_needs_assignment(obj):
            return False
        if not obj.scheduled_at:
            return False
        return obj.scheduled_at <= timezone.now() + timezone.timedelta(hours=24)

    def get_status(self, obj):
        if (
            obj.scheduled_at
            and obj.scheduled_at < timezone.now()
            and obj.status in ["pending", "confirmed"]
        ):
            return "expired"
        return obj.status
