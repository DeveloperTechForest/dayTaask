from users_app.models.role import UserRole
from users_app.models.permission import RolePermission


def get_user_permissions(user):
    roles = UserRole.objects.filter(
        user=user).values_list('role_id', flat=True)

    perms = RolePermission.objects.filter(
        role__in=roles).values_list('permission__code_name', flat=True)

    return list(set(perms))


def user_has_permission(user, code_name):
    return code_name in get_user_permissions(user)
