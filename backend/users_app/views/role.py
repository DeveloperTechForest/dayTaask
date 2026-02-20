from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from users_app.serializers.role import RoleSerializer
from users_app.models.role import Role
from users_app.permissions import HasCustomPermission


class RoleViewSet(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'list':
            HasCustomPermission.required_permissions = "role.view"
        elif self.action == 'create':
            HasCustomPermission.required_permissions = "role.create"
        elif self.action in ['update', 'partial_update']:
            HasCustomPermission.required_permissions = "role.update"
        elif self.action == 'destroy':
            HasCustomPermission.required_permissions = "role.delete"

        return [IsAuthenticated(), HasCustomPermission()]
