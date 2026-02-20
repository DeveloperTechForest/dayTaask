# users_app/serializers/user_role.py


from rest_framework import serializers
from users_app.models.role import UserRole


class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ['id', 'user', 'role']
