# bookings_app/serializers/admin/admin_booking_create_serializer.py

from rest_framework import serializers
from django.utils import timezone

from bookings_app.models import Booking, AssignmentLog
from users_app.models import User
from bookings_app.serializers.utils.assignment_utils import accepted_taaskr_count


class AdminBookingCreateSerializer(serializers.ModelSerializer):

    taaskr_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        write_only=True
    )

    class Meta:
        model = Booking
        fields = [
            "id",
            "customer",
            "service",
            "address",
            "scheduled_at",
            "required_taaskrs",
            "priority",
            "total_price",
            "location_notes",
            "taaskr_ids",
        ]

    def create(self, validated_data):
        request = self.context["request"]
        taaskr_ids = validated_data.pop("taaskr_ids", [])

        booking = Booking.objects.create(
            **validated_data,
            status="confirmed" if taaskr_ids else "pending",
            assignment_status="unassigned",
        )

        max_assignable = booking.required_taaskrs

        for taaskr_id in taaskr_ids[:max_assignable]:
            AssignmentLog.objects.create(
                booking=booking,
                taaskr_id=taaskr_id,
                assigned_by=request.user,
                method="manual",
                status="requested",
                expires_at=timezone.now() + timezone.timedelta(hours=2),
            )

        # 🔹 Final assignment status
        accepted = accepted_taaskr_count(booking)
        if accepted >= booking.required_taaskrs:
            booking.assignment_status = "assigned"
        elif accepted > 0:
            booking.assignment_status = "partially_assigned"

        booking.save(update_fields=["assignment_status"])

        return booking
