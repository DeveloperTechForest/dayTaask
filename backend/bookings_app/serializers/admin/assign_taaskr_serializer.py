# bookings_app/serializers/admin/assign_taaskr_serializer.py

from rest_framework import serializers
from django.utils import timezone

from bookings_app.models import Booking, AssignmentLog
from users_app.models import User


class AssignTaaskrSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    taaskr_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1
    )

    def validate_booking_id(self, value):
        if not Booking.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid booking_id")
        return value

    def validate_taaskr_ids(self, value):
        from users_app.models import User

        taaskrs = User.objects.filter(
            id__in=value,
            taaskrprofile__isnull=False
        ).distinct()

        if taaskrs.count() != len(value):
            raise serializers.ValidationError(
                "One or more users are not valid taaskrs"
            )

        return value

    def create(self, validated_data):
        request = self.context["request"]

        booking = Booking.objects.get(id=validated_data["booking_id"])
        taaskr_ids = validated_data["taaskr_ids"]

        max_required = booking.required_taaskrs

        for taaskr_id in taaskr_ids[:max_required]:
            AssignmentLog.objects.create(
                booking=booking,
                taaskr_id=taaskr_id,
                assigned_by=request.user,
                method="manual",
                status="requested",
                expires_at=timezone.now() + timezone.timedelta(hours=2),
            )

        # booking stays pending until accepted
        booking.assignment_status = "requested"
        booking.save(update_fields=["assignment_status"])

        return booking
