# users_app/views/permission.py

from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated
from users_app.models.permission import Permission
from users_app.serializers.permission import PermissionSerializer
from users_app.permissions import HasCustomPermission


class PermissionViewSet(ReadOnlyModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsAuthenticated, HasCustomPermission]

    def get_permissions(self):
        HasCustomPermission.required_permissions = "permission.view"
        return super().get_permissions()
