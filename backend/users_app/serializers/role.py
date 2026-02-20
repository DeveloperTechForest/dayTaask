from rest_framework import serializers
from users_app.models.role import Role
from users_app.models.permission import RolePermission


class RoleSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = Role
        fields = ["id", "name", "is_admin_role", "is_active", "permissions"]

    def get_permissions(self, role):
        perms = (
            RolePermission.objects
            .filter(role=role)
            .select_related("permission")
            .values_list("permission__code_name", flat=True)
        )
        return list(set(perms))
