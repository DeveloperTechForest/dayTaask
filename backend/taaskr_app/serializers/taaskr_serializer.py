# taaskr_app/serializers/taaskr_serializer.py

from rest_framework import serializers
from taaskr_app.models.profile import TaaskrProfile
from taaskr_app.models.service_area import ServiceArea
from taaskr_app.serializers.service_area_serializer import ServiceAreaSerializer
from users_app.models.user import User


def _parse_text_list(value):
    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        cleaned = value.strip()
        if not cleaned:
            return []
        return [item.strip() for item in cleaned.split(",") if item.strip()]
    return []


class FlexibleListField(serializers.Field):
    def to_representation(self, value):
        return _parse_text_list(value)

    def to_internal_value(self, data):
        if data in (None, ""):
            return []
        if isinstance(data, list):
            return data
        if isinstance(data, str):
            return _parse_text_list(data)
        raise serializers.ValidationError("Expected a list or string.")


class SingleStringListField(serializers.Field):
    def to_representation(self, value):
        if not value:
            return []
        return [value]

    def to_internal_value(self, data):
        if data in (None, ""):
            return ""
        if isinstance(data, list):
            return data[0] if data else ""
        if isinstance(data, str):
            return data
        raise serializers.ValidationError("Expected a list or string.")


class UserReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "full_name", "email", "phone", "phone_verified", "profile_image"]


class TaaskrReadSerializer(serializers.ModelSerializer):
    user = UserReadSerializer(read_only=True)
    service_areas = serializers.SerializerMethodField()
    skill_tags = FlexibleListField()
    certification = SingleStringListField()

    def get_service_areas(self, obj):
        areas = ServiceArea.objects.filter(taaskr_links__taaskr=obj.user)
        return ServiceAreaSerializer(areas, many=True).data

    class Meta:
        model = TaaskrProfile
        fields = [
            "id",
            "user",
            "bio",
            "skill_tags",
            "certification",
            "dob",
            "bank_account_holder_name",
            "bank_account_number",
            "bank_ifsc_code",
            "bank_name",
            "bank_upi_id",
            "government_id_image",
            "address_proof_image",
            "profile_photo_image",
            "service_areas",
            "rating_avg",
            "total_jobs",
            "verified",
            "onboarding_completed",
            "verification_status",
            "verification_note",
            "documents_verified",
            "bank_verified",
            # add others as needed
        ]
