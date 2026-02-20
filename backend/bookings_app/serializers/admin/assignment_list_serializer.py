# bookings_app/serializers/admin/assignment_list_serializer.py

from rest_framework import serializers
from bookings_app.models import AssignmentLog


class AssignmentListSerializer(serializers.ModelSerializer):
    booking_code = serializers.CharField(
        source="booking.booking_code", read_only=True
    )
    service_name = serializers.CharField(
        source="booking.service.name", read_only=True
    )
    customer_name = serializers.CharField(
        source="booking.customer.full_name", read_only=True
    )
    taaskr_name = serializers.CharField(
        source="taaskr.full_name", read_only=True
    )
    taaskr_phone = serializers.CharField(source="taaskr.phone", read_only=True)
    assigned_by = serializers.CharField(
        source="assigned_by.full_name", read_only=True
    )

    class Meta:
        model = AssignmentLog
        fields = [
            "id",
            "booking",
            "booking_code",
            "service_name",
            "customer_name",
            "taaskr",
            "taaskr_name",
            "taaskr_phone",
            "assigned_by",
            "status",
            "method",
            "expires_at",
            "created_at",
            "updated_at",
        ]
