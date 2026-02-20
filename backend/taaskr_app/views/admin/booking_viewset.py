from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from bookings_app.models import Booking
from bookings_app.serializers.admin.booking_list_serializer import (
    BookingAdminListSerializer,
)
from bookings_app.serializers.admin.booking_detail_serializer import (
    BookingAdminDetailSerializer,
)
from bookings_app.serializers.admin.assign_taaskr_serializer import (
    AssignTaaskrSerializer,
)

from users_app.permissions import HasCustomPermission


class AdminBookingViewSet(ModelViewSet):
    """
    Admin Booking Management

    - list: View all bookings
    - retrieve: Booking details
    - create: Create booking for any customer
    - update: Modify booking
    - assign_taaskr: Manual assignment
    - change_status: Update booking status
    """

    queryset = (
        Booking.objects
        .select_related("customer", "service", "assigned_taaskr")
        .order_by("-created_at")
    )

    # -------------------------
    # SERIALIZER SELECTION
    # -------------------------
    def get_serializer_class(self):
        if self.action == "list":
            return BookingAdminListSerializer

        if self.action == "assign_taaskr":
            return AssignTaaskrSerializer

        return BookingAdminDetailSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [IsAuthenticated, HasCustomPermission]
            HasCustomPermission.required_permissions = "booking.view"

        elif self.action == "create":
            permission_classes = [IsAuthenticated, HasCustomPermission]
            HasCustomPermission.required_permissions = "booking.create"

        elif self.action in ["update", "partial_update"]:
            permission_classes = [IsAuthenticated, HasCustomPermission]
            HasCustomPermission.required_permissions = "booking.update"

        elif self.action == "assign_taaskr":
            permission_classes = [IsAuthenticated, HasCustomPermission]
            HasCustomPermission.required_permissions = "booking.assign"

        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save()

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsAuthenticated, HasCustomPermission],
    )
    def assign_taaskr(self, request):
        """
        POST /api/bookings/admin/bookings/assign_taaskr/
        """
        HasCustomPermission.required_permissions = "booking.assign"

        serializer = AssignTaaskrSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        return Response(
            BookingAdminDetailSerializer(booking).data,
            status=status.HTTP_200_OK,
        )

    # if request.data.get("auto_assign"):
    #             # distance + availability logic

    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[IsAuthenticated, HasCustomPermission],
    )
    def change_status(self, request, pk=None):
        """
        PATCH /admin/bookings/{id}/change_status/
        """
        HasCustomPermission.required_permissions = "booking.update"

        booking = self.get_object()
        new_status = request.data.get("status")

        if not new_status:
            return Response(
                {"error": "Status is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.status = new_status
        booking.save(update_fields=["status"])

        return Response(
            {"message": "Booking status updated", "status": booking.status},
            status=status.HTTP_200_OK,
        )
