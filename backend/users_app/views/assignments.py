# users_app/views/assignments.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from users_app.models import Role, Permission, RolePermission
from users_app.permissions import HasCustomPermission


class AssignPermissionToRole(APIView):
    permission_classes = [IsAuthenticated, HasCustomPermission]
    required_permissions = "permission.assign"

    def post(self, request):
        role_id = request.data.get("role_id")
        permissions = request.data.get("permissions", [])

        role = Role.objects.get(id=role_id)

        RolePermission.objects.filter(role=role).delete()

        bulk = []
        for perm in permissions:
            p = Permission.objects.get(code_name=perm)
            bulk.append(RolePermission(role=role, permission=p))

        RolePermission.objects.bulk_create(bulk)

        return Response({"success": True})
