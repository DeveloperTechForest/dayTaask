# bookings_app/serializers/taaskr/taaskr_assignment_action_serializer.py

from rest_framework import serializers
from bookings_app.models import AssignmentLog
from django.utils import timezone


class TaaskrAssignmentActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["accept", "reject"])

    def validate(self, attrs):
        instance = self.context["instance"]  # we'll pass it via view
        if instance.status != "requested":
            raise serializers.ValidationError(
                {"action": "This assignment request is no longer pending."}
            )
        if instance.expires_at and instance.expires_at < timezone.now():
            raise serializers.ValidationError(
                {"action": "This assignment request has expired."}
            )
        return attrs

    def update(self, instance, validated_data):
        action = validated_data["action"]
        booking = instance.booking

        # assume you have this
        from bookings_app.serializers.utils.assignment_utils import accepted_taaskr_count

        accepted_count = accepted_taaskr_count(booking)

        if action == "accept":
            if accepted_count >= booking.required_taaskrs:
                raise serializers.ValidationError(
                    {"action": "All required taaskrs have already been assigned."}
                )
            instance.status = "accepted"
        else:
            instance.status = "rejected"

        instance.save()

        # Re-check after action
        accepted_count = accepted_taaskr_count(booking)

        if accepted_count >= booking.required_taaskrs:
            # Auto-cancel remaining pending requests
            AssignmentLog.objects.filter(
                booking=booking,
                status="requested"
            ).exclude(id=instance.id).update(status="expired")

            booking.assignment_status = "assigned"
            booking.status = "confirmed"  # or your logic
            booking.save()

        return instance
