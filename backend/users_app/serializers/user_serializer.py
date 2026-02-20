# users_app/serializers/user_serializer.py

from rest_framework import serializers
from users_app.models.role import Role, UserRole
from users_app.models.permission import RolePermission, Permission


class PermissionSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["code_name"]


class RoleWithPermissionsSerializer(serializers.ModelSerializer):
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
            .distinct()
        )
        return sorted(list(perms))


class UserMeSerializer(serializers.Serializer):
    """Custom serializer for /me/ endpoint with context support"""
    id = serializers.IntegerField(read_only=True)
    full_name = serializers.CharField(read_only=True, default="")
    email = serializers.EmailField(read_only=True)
    phone = serializers.CharField(
        read_only=True, allow_null=True, default=None)
    profile_image = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    def get_profile_image(self, user):
        if user.profile_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(user.profile_image.url)
            return user.profile_image.url
        return None

    def get_role(self, user):
        context = self.context.get(
            "view").request.query_params.get("context", "default")
        user_roles = UserRole.objects.filter(user=user).select_related("role")

        if context == "admin":
            user_roles = user_roles.filter(role__is_admin_role=True)

        roles_data = []
        for ur in user_roles:
            roles_data.append(RoleWithPermissionsSerializer(ur.role).data)

        return roles_data

    def get_permissions(self, user):
        context = self.context.get(
            "view").request.query_params.get("context", "default")
        user_roles = UserRole.objects.filter(user=user).select_related("role")

        if context == "admin":
            user_roles = user_roles.filter(role__is_admin_role=True)

        all_perms = set()
        for ur in user_roles:
            role_perms = (
                RolePermission.objects
                .filter(role=ur.role)
                .values_list("permission__code_name", flat=True)
                .distinct()
            )
            all_perms.update(role_perms)

        return sorted(list(all_perms))
