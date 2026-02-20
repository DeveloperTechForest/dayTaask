from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.filters import SearchFilter

from services_app.models.service import Service
from services_app.serializers.admin.servicesSerializers import AdminServiceSerializer
from users_app.permissions import HasCustomPermission


class AdminServiceViewSet(ModelViewSet):
    queryset = Service.objects.select_related("category")
    serializer_class = AdminServiceSerializer
    lookup_field = "id"

    filter_backends = [SearchFilter]
    search_fields = ["name", "short_description", "description"]

    def get_permissions(self):
        permission_map = {
            "list": "service.view",
            "retrieve": "service.view",
            "create": "service.create",
            "update": "service.update",
            "partial_update": "service.update",
            "destroy": "service.delete",
            "toggle_active": "service.update",
        }

        perm = permission_map.get(self.action)

        if perm:
            HasCustomPermission.required_permissions = perm

        return [
            IsAuthenticated(),
            HasCustomPermission(),
        ]

    @action(detail=True, methods=["patch"])
    def toggle_active(self, request, id=None):
        service = self.get_object()
        service.is_active = not service.is_active
        service.save(update_fields=["is_active"])

        return Response(
            {
                "message": "Service activated" if service.is_active else "Service deactivated",
                "is_active": service.is_active,
            },
            status=status.HTTP_200_OK,
        )
