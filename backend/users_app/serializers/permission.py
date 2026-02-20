# users_app/serializers/permission.py

from rest_framework import serializers
from users_app.models.permission import Permission


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["id", "code_name", "description"]
