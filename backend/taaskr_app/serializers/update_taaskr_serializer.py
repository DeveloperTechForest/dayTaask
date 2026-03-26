# taaskr_app/serializers/update_taaskr_serializer.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from taaskr_app.models.profile import TaaskrProfile
from taaskr_app.serializers.taaskr_serializer import FlexibleListField, SingleStringListField

User = get_user_model()


class TaaskrProfileUpdateSerializer(serializers.ModelSerializer):
    skill_tags = FlexibleListField(required=False)
    certification = SingleStringListField(required=False)

    class Meta:
        model = TaaskrProfile
        fields = [
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
            "onboarding_completed",
            "verified",
            "verification_status",
            "verification_note",
            "documents_verified",
            "bank_verified",
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
            "profile_image",
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
