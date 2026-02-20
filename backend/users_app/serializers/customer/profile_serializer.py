from rest_framework import serializers
from users_app.models.user import User


class ProfileReadSerializer(serializers.ModelSerializer):
    addresses_count = serializers.IntegerField(
        source='addresses.count',
        read_only=True
    )
    member_since = serializers.DateTimeField(
        source='date_joined',
        format='%B %Y',
        read_only=True
    )

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
            'date_joined',
            'member_since',
            'addresses_count',
            'is_active',
        ]
        read_only_fields = [
            'id', 'email', 'email_verified', 'phone_verified',
            'date_joined', 'member_since', 'addresses_count', 'is_active'
        ]


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'phone']
        extra_kwargs = {
            'phone': {'required': False, 'allow_blank': True},
        }

    def validate_phone(self, value):
        if value and User.objects.filter(phone=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError(
                "This phone number is already in use.")
        return value


class AvatarUploadSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=True)

    class Meta:
        model = User
        fields = ['profile_image']
