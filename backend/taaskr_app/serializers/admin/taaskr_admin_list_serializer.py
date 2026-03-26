from rest_framework import serializers
from users_app.models import User
from taaskr_app.models.profile import TaaskrProfile
from taaskr_app.models.availability import Availability
from bookings_app.models import AssignmentLog
from taaskr_app.serializers.taaskr_serializer import _parse_text_list


class TaaskrAdminListSerializer(serializers.ModelSerializer):
    skill_tags = serializers.SerializerMethodField()
    rating_avg = serializers.FloatField(
        source="taaskrprofile.rating_avg", read_only=True)
    total_jobs = serializers.IntegerField(
        source="taaskrprofile.total_jobs", read_only=True)
    verified = serializers.BooleanField(
        source="taaskrprofile.verified", read_only=True)

    is_available = serializers.SerializerMethodField()
    accepted_count = serializers.SerializerMethodField()
    rejected_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "phone",
            "skill_tags",
            "rating_avg",
            "total_jobs",
            "verified",
            "is_available",
            "accepted_count",
            "rejected_count",
        ]

    def get_is_available(self, obj):
        # Latest availability record
        latest = Availability.objects.filter(
            taaskr=obj).order_by("-updated_at").first()
        return latest.is_available if latest else True

    def get_skill_tags(self, obj):
        profile = getattr(obj, "taaskrprofile", None)
        return _parse_text_list(profile.skill_tags) if profile else []

    def get_accepted_count(self, obj):
        return AssignmentLog.objects.filter(taaskr=obj, status="accepted").count()

    def get_rejected_count(self, obj):
        return AssignmentLog.objects.filter(taaskr=obj, status="rejected").count()
