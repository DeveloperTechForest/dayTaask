# taaskr_app/serializers/availability_serializer.py
from rest_framework import serializers
from taaskr_app.models.availability import Availability


class AvailabilitySerializer(serializers.ModelSerializer):
    day_of_week_display = serializers.CharField(
        source="get_day_of_week_display", read_only=True
    )
    taaskr_name = serializers.CharField(
        source="taaskr.get_full_name", read_only=True
    )
    taaskr_username = serializers.CharField(
        source="taaskr.username", read_only=True
    )

    class Meta:
        model = Availability
        fields = [
            "id",
            "taaskr",
            "taaskr_name",
            "taaskr_username",
            "day_of_week",
            "day_of_week_display",
            "start_time",
            "end_time",
            "is_available",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["taaskr_name",
                            "taaskr_username", "created_at", "updated_at"]
        # Do NOT make "taaskr" read-only here — admin needs to set it

    def validate(self, data):
        start_time = data.get("start_time")
        end_time = data.get("end_time")
        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError(
                "Start time must be before end time.")
        return data
