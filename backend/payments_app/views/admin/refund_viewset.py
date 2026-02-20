from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from payments_app.models import Refund
from payments_app.serializers.admin.refund_serializers import (
    AdminRefundSerializer,
    AdminRefundCreateSerializer,
)
from users_app.permissions import HasCustomPermission


class AdminRefundViewSet(ModelViewSet):
    queryset = Refund.objects.select_related(
        "payment",
        "payment__booking"
    ).order_by("-created_at")

    http_method_names = ["get", "post"]

    def get_serializer_class(self):
        if self.action == "create":
            return AdminRefundCreateSerializer
        return AdminRefundSerializer

    def get_permissions(self):
        permission_map = {
            "list": "payment.view",
            "retrieve": "payment.view",
            "create": "payment.refund",
        }

        HasCustomPermission.required_permissions = permission_map.get(
            self.action
        )
        return [IsAuthenticated(), HasCustomPermission()]

    def perform_create(self, serializer):
        refund = serializer.save(refund_status="processed")

        # 🔁 Update booking payment summary
        booking = refund.payment.booking
        booking.paid_amount -= refund.amount

        if booking.paid_amount <= 0:
            booking.payment_status = "pending"
        elif booking.paid_amount < booking.total_price:
            booking.payment_status = "partial"

        booking.save(
            update_fields=["paid_amount", "payment_status"]
        )
