# users_app/views/admin/customer_viewset.py


from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from users_app.models.user import User
from users_app.models.role import UserRole
from users_app.serializers.admin.customer_serializers import (
    CustomerListSerializer,
    CustomerCreateSerializer,
    CustomerUpdateSerializer,
)
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from users_app.permissions import HasCustomPermission
from rest_framework.filters import SearchFilter


class AdminCustomerViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, HasCustomPermission]
    lookup_field = "id"

    filter_backends = [SearchFilter]
    search_fields = [
        "id",
        "full_name",
        "email",
        "phone",
    ]

    def get_queryset(self):
        return User.objects.filter(
            userrole__role__name="customer"
        ).distinct()

    def get_serializer_class(self):
        if self.action == "create":
            return CustomerCreateSerializer
        if self.action in ["update", "partial_update"]:
            return CustomerUpdateSerializer
        return CustomerListSerializer

    def get_permissions(self):
        permission_map = {
            "list": "user.view",
            "retrieve": "user.view",
            "create": "user.create",
            "update": "user.update",
            "partial_update": "user.update",
            "destroy": "user.delete",
            "toggle_active": "user.update",
        }

        perm = permission_map.get(self.action)

        if perm:
            HasCustomPermission.required_permissions = perm

        return [
            IsAuthenticated(),
            HasCustomPermission(),
        ]

    @action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated])
    def toggle_active(self, request, id=None):
        customer = self.get_object()
        customer.is_active = not customer.is_active
        customer.save()

        status_msg = "Customer activated" if customer.is_active else "Customer deactivated"

        return Response({
            "message": status_msg,
            "is_active": customer.is_active
        }, status=status.HTTP_200_OK)
