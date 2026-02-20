from rest_framework import serializers
from users_app.models import User
from taaskr_app.models.profile import TaaskrProfile
from taaskr_app.models.availability import Availability
from bookings_app.models import AssignmentLog


class TaaskrAdminListSerializer(serializers.ModelSerializer):
    skill_tags = serializers.ListField(
        source="taaskrprofile.skill_tags", read_only=True)
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

    def get_accepted_count(self, obj):
        return AssignmentLog.objects.filter(taaskr=obj, status="accepted").count()

    def get_rejected_count(self, obj):
        return AssignmentLog.objects.filter(taaskr=obj, status="rejected").count()
