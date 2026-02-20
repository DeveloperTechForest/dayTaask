from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from bookings_app.models import CustomService
from bookings_app.serializers.admin.custom_service_serializers import (
    AdminCustomServiceSerializer,
    AdminCustomServiceCreateSerializer,
    AdminCustomServiceUpdateSerializer,
    AdminAttachCustomServiceToBookingSerializer,
)
from users_app.permissions import HasCustomPermission


class AdminCustomServiceViewSet(ModelViewSet):
    """
    Admin Custom Service APIs

    - Create custom service from quote
    - View / list
    - Edit (allowed until completed)
    - Delete (blocked after booking)
    - Attach to booking after payment
    """

    queryset = (
        CustomService.objects
        .select_related(
            "quote_request",
            "quote_request__customer",
            "created_by",
            "base_service",
        )
        .prefetch_related("booking")
        .order_by("-created_at")
    )

    http_method_names = ["get", "post", "patch", "delete"]

    def get_serializer_class(self):
        if self.action == "create":
            return AdminCustomServiceCreateSerializer

        if self.action in ["update", "partial_update"]:
            return AdminCustomServiceUpdateSerializer

        if self.action == "attach_booking":
            return AdminAttachCustomServiceToBookingSerializer

        return AdminCustomServiceSerializer

    def get_permissions(self):
        permission_map = {
            "list": "quote.view",
            "retrieve": "quote.view",
            "create": "quote.update",
            "update": "quote.update",
            "partial_update": "quote.update",
            "destroy": "quote.delete",
            "attach_booking": "booking.update",
        }

        HasCustomPermission.required_permissions = permission_map.get(
            self.action
        )
        return [IsAuthenticated(), HasCustomPermission()]

    @action(detail=True, methods=["post"])
    def attach_booking(self, request, pk=None):
        custom_service = self.get_object()

        serializer = self.get_serializer(
            data=request.data,
            context={"custom_service": custom_service}
        )
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        return Response(
            {
                "detail": "Custom service attached to booking",
                "booking_id": booking.id,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"])
    def send_to_customer(self, request, pk=None):
        custom_service = self.get_object()

        if custom_service.status != "draft":
            return Response(
                {"detail": "Already sent"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        custom_service.status = "sent"
        custom_service.save(update_fields=["status"])

        return Response(
            {"detail": "Quote sent to customer"},
            status=status.HTTP_200_OK,
        )
