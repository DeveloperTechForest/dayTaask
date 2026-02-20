# service_app/views/admin/addon_viewset.py

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from users_app.permissions import HasCustomPermission
from services_app.models.addon import Addon
from services_app.serializers.admin.addonSerializers import AddonSerializer


class AdminAddonViewSet(ModelViewSet):
    queryset = Addon.objects.all()
    serializer_class = AddonSerializer
    lookup_field = "id"

    def get_permissions(self):
        permission_map = {
            "list": "addon.view",
            "retrieve": "addon.view",
            "create": "addon.create",
            "update": "addon.update",
            "partial_update": "addon.update",
            "destroy": "addon.delete",
            "toggle_active": "addon.update",
        }

        perm = permission_map.get(self.action)

        permissions = [IsAuthenticated()]

        if perm:
            permissions.append(HasCustomPermission())

        return permissions

    @action(detail=True, methods=["patch"])
    def toggle_active(self, request, id=None):
        addon = self.get_object()
        addon.is_active = not addon.is_active
        addon.save()

        return Response(
            {
                "message": "Addon activated" if addon.is_active else "Addon deactivated",
                "is_active": addon.is_active
            },
            status=status.HTTP_200_OK
        )
