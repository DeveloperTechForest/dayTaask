# taaskr_app/views/admin_availability_viewset.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from taaskr_app.models.availability import Availability
from taaskr_app.serializers.admin.taaskr_availability_serializer import AvailabilitySerializer
from users_app.permissions import HasCustomPermission


class AdminAvailabilityViewSet(viewsets.ModelViewSet):
    """
    ADMIN ONLY: Full CRUD on all Taaskr availability records
    """
    queryset = Availability.objects.all().select_related("taaskr").order_by(
        "taaskr__full_name", "taaskr__email",
    )
    serializer_class = AvailabilitySerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            perm = "taaskr.availability.view"
        elif self.action == "create":
            perm = "taaskr.availability.create"
        elif self.action in ["update", "partial_update"]:
            perm = "taaskr.availability.update"
        elif self.action == "destroy":
            perm = "taaskr.availability.delete"
        else:
            perm = "taaskr.availability.view"

        HasCustomPermission.required_permissions = perm
        return [IsAuthenticated(), HasCustomPermission()]
