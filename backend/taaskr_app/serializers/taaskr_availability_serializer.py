# taaskr_app/serializers/availability_serializer.py
from rest_framework import serializers
from taaskr_app.models.availability import Availability


class AvailabilitySerializer(serializers.ModelSerializer):
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
            "is_available",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["taaskr", "taaskr_name",
                            "taaskr_username", "created_at", "updated_at"]

    def create(self, validated_data):
        """
        Automatically assign the taaskr from the authenticated user
        """
        request = self.context["request"]
        validated_data["taaskr"] = request.user
        return super().create(validated_data)
