# users_app/permissions/rbac.py

from rest_framework.permissions import BasePermission
from users_app.models.role import UserRole
from users_app.models.permission import RolePermission


class HasCustomPermission(BasePermission):
    def __init__(self, required_permissions=None):
        self.required_permissions = required_permissions

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        if not self.required_permissions:
            return False

        roles = UserRole.objects.filter(user=request.user)\
            .values_list("role_id", flat=True)

        return RolePermission.objects.filter(
            role_id__in=roles,
            permission__code_name=self.required_permissions
        ).exists()
