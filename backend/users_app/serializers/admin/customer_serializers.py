# users_app/serializers/admin/customer_serializers.py

from rest_framework import serializers
from users_app.models.user import User
from users_app.models.role import Role, UserRole
from users_app.serializers.admin.customer_address_serializer import (
    AdminCustomerAddressSerializer,
)


class CustomerListSerializer(serializers.ModelSerializer):
    addresses = AdminCustomerAddressSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "phone",
            "full_name",
            "is_active",  # directly use this instead of is_blocked
            "date_joined",
            "last_login",
            "email_verified",
            "phone_verified",
            "profile_image",
            "addresses",
        ]


class CustomerCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "phone", "full_name", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        role = Role.objects.get(name="customer")
        UserRole.objects.create(user=user, role=role)

        return user


class CustomerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "phone", "full_name", "is_active"]
