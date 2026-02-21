# users_app/serializers/customer/profile_serializer.py
from django.conf import settings
from rest_framework import serializers
from users_app.models.user import User


class ProfileReadSerializer(serializers.ModelSerializer):
    addresses_count = serializers.IntegerField(
        source='addresses.count',
        read_only=True
    )
    member_since = serializers.DateTimeField(
        source='date_joined',
        format='%B %Y',          # → "February 2026"
        read_only=True
    )
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'full_name',
            'email',
            'phone',
            'profile_image',
            'email_verified',
            'phone_verified',
            'member_since',
            'addresses_count',
            'date_joined',
            'is_active',
        ]
        read_only_fields = [
            'id', 'email', 'email_verified', 'phone_verified',
            'member_since', 'addresses_count', 'date_joined', 'is_active'
        ]

    def get_profile_image(self, obj):
        if not obj.profile_image:
            return None  # or your preferred fallback

        request = self.context.get('request')
        if request:
            # This gives full absolute URL automatically (http(s)://domain:port/path)
            return request.build_absolute_uri(obj.profile_image.url)

        # Fallback when request is not available (very rare in normal views)
        # Use your production domain from settings or environment
        base_url = getattr(settings, 'BASE_URL', 'http://localhost:8000')
        return f"{base_url.rstrip('/')}{obj.profile_image.url}"


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'phone']

    def validate_phone(self, value):
        if value and User.objects.filter(phone=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError(
                "This phone number is already in use.")
        return value


class AvatarUploadSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=True, allow_null=False)

    class Meta:
        model = User
        fields = ['profile_image']

    def update(self, instance, validated_data):
        # django-cleanup will automatically delete old file when we assign new one
        instance.profile_image = validated_data.get(
            'profile_image', instance.profile_image)
        instance.save()
        return instance
