# users_app/serializers/register_serializer.py


from rest_framework import serializers
from users_app.models.user import User
from users_app.models.role import Role, UserRole


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'phone']

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        default_role, _ = Role.objects.get_or_create(name="customer")
        UserRole.objects.create(user=user, role=default_role)

        return user
