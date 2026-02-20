from rest_framework import serializers
from bookings_app.models import Booking


class NeedyAssignmentSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.full_name", read_only=True)
    service_name = serializers.CharField(source="service.name", read_only=True)
    city = serializers.CharField(source="address.city", read_only=True)

    accepted_taaskrs = serializers.SerializerMethodField()
    is_urgent = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_code",
            "customer_name",
            "service_name",
            "city",
            "scheduled_at",
            "required_taaskrs",
            "accepted_taaskrs",
            "assignment_status",
            "priority",
            "is_urgent",
            "total_price",
            "location_notes",
            "created_at",
        ]

    def get_accepted_taaskrs(self, obj):
        return obj.assignments.filter(status="accepted").count()

    def get_is_urgent(self, obj):
        return (
            obj.assignment_status != "assigned"
            or self.get_accepted_taaskrs(obj) < obj.required_taaskrs
        )
