from rest_framework import serializers
from django.utils import timezone
from bookings_app.models import Booking


class NeedyAssignmentSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.full_name", read_only=True)
    service_name = serializers.CharField(source="service.name", read_only=True)
    city = serializers.CharField(source="address.city", read_only=True)

    accepted_taaskrs = serializers.SerializerMethodField()
    needs_assignment = serializers.SerializerMethodField()
    is_urgent = serializers.SerializerMethodField()
    display_status = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_code",
            "customer_name",
            "service_name",
            "city",
            "scheduled_at",
            "display_status",
            "required_taaskrs",
            "accepted_taaskrs",
            "assignment_status",
            "priority",
            "needs_assignment",
            "is_urgent",
            "total_price",
            "location_notes",
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

    def get_display_status(self, obj):
        if (
            obj.scheduled_at
            and obj.scheduled_at < timezone.now()
            and obj.status in ["pending", "confirmed"]
        ):
            return "expired"
        return obj.status
