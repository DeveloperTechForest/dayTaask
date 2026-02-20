# users_app/views/admin/customer_address_viewset.py

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from users_app.models.address import Address
from users_app.serializers.admin.customer_address_serializer import (
    AdminCustomerAddressSerializer
)
from users_app.permissions import HasCustomPermission


class AdminCustomerAddressViewSet(ModelViewSet):
    serializer_class = AdminCustomerAddressSerializer
    permission_classes = [IsAuthenticated, HasCustomPermission]

    def get_queryset(self):
        return Address.objects.filter(
            user_id=self.kwargs["customer_id"]
        )

    def perform_create(self, serializer):
        serializer.save(user_id=self.kwargs["customer_id"])

    def get_permissions(self):
        return [
            IsAuthenticated(),
            HasCustomPermission(),
        ]
