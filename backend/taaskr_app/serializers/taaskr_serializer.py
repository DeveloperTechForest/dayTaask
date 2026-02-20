# taaskr_app/serializers/taaskr_serializer.py

from rest_framework import serializers
from taaskr_app.models.profile import TaaskrProfile
from users_app.models.user import User


class UserReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "full_name", "email", "phone", "phone_verified"]


class TaaskrReadSerializer(serializers.ModelSerializer):
    user = UserReadSerializer(read_only=True)

    class Meta:
        model = TaaskrProfile
        fields = [
            "id",
            "user",
            "bio",
            "skill_tags",
            "certification",
            "rating_avg",
            "total_jobs",
            "verified",
            # add others as needed
        ]
