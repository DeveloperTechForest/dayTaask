from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from payments_app.models import Payment
from payments_app.serializers.admin.payment_serializers import (
    AdminPaymentSerializer,
    AdminPaymentCreateSerializer,
    AdminPaymentUpdateSerializer,
)
from users_app.permissions import HasCustomPermission


class AdminPaymentViewSet(ModelViewSet):
    """
    Admin Payment APIs
    - View all payments
    - Create manual payment (COD / cash / adjustment)
    - Update payment status
    """

    queryset = (
        Payment.objects
        .select_related(
            "booking",
            "booking__customer"
        )
        .order_by("-created_at")
    )

    http_method_names = ["get", "post", "patch"]

    # ---------------------------
    # SERIALIZERS
    # ---------------------------
    def get_serializer_class(self):
        if self.action == "create":
            return AdminPaymentCreateSerializer
        if self.action in ["update", "partial_update"]:
            return AdminPaymentUpdateSerializer
        return AdminPaymentSerializer

    # ---------------------------
    # PERMISSIONS
    # ---------------------------
    def get_permissions(self):
        permission_map = {
            "list": "payment.view",
            "retrieve": "payment.view",
            "create": "payment.create",
            "update": "payment.update",
            "partial_update": "payment.update",
        }

        HasCustomPermission.required_permissions = permission_map.get(
            self.action
        )
        return [IsAuthenticated(), HasCustomPermission()]
