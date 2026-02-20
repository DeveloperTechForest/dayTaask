# taaskr_app/serializers/register_taaskr_serializer.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from taaskr_app.models.profile import TaaskrProfile
from users_app.models.role import Role, UserRole

User = get_user_model()


class TaaskrProfileCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaaskrProfile
        fields = [
            "bio",
            "skill_tags",
            "certification",
        ]


class RegisterTaaskrSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=6
    )
    profile = TaaskrProfileCreateSerializer(write_only=True)

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "full_name",
            "phone",
            "profile",
        ]

    # --------------------
    # VALIDATIONS
    # --------------------

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone number already exists.")
        return value

    # --------------------
    # CREATE
    # --------------------

    def create(self, validated_data):
        profile_data = validated_data.pop("profile")
        password = validated_data.pop("password")

        # Create user
        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        # Create taaskr profile
        TaaskrProfile.objects.create(
            user=user,
            **profile_data
        )

        # Assign taaskr role
        role, _ = Role.objects.get_or_create(
            name="taaskr",
            defaults={"is_admin_role": False}
        )
        UserRole.objects.get_or_create(
            user=user,
            role=role
        )

        return user
