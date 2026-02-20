from rest_framework.permissions import BasePermission
from users_app.utils.rbac import user_has_permission


class HasCustomPermission(BasePermission):
    required_permissions = None

    def has_permission(self, request, view):
        if not self.required_permissions:
            return True
        return user_has_permission(request.user, self.required_permissions)
