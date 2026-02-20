# taaskr_app/serializers/update_taaskr_serializer.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from taaskr_app.models.profile import TaaskrProfile

User = get_user_model()


class TaaskrProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaaskrProfile
        fields = [
            "bio",
            "skill_tags",
            "certification",
        ]


class UpdateTaaskrSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=6,
        required=False
    )
    profile = TaaskrProfileUpdateSerializer(required=False)

    class Meta:
        model = User
        fields = [
            "email",
            "full_name",
            "phone",
            "password",
            "profile",
        ]

    # --------------------
    # VALIDATIONS
    # --------------------

    def validate_email(self, value):
        user = self.instance
        if User.objects.exclude(id=user.id).filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_phone(self, value):
        user = self.instance
        if User.objects.exclude(id=user.id).filter(phone=value).exists():
            raise serializers.ValidationError("Phone number already exists.")
        return value

    # --------------------
    # UPDATE
    # --------------------

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)
        password = validated_data.pop("password", None)

        # Update USER fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        # Update PROFILE fields
        if profile_data is not None:
            profile, _ = TaaskrProfile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        return instance
