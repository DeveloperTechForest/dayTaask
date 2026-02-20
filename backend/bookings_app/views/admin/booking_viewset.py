# bookings_app/views/admin/booking_viewset.py

from django.db.models import Q
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from bookings_app.models import Booking, AssignmentLog
from bookings_app.serializers.admin.booking_list_serializer import (
    BookingAdminListSerializer,
)
from bookings_app.serializers.admin.booking_detail_serializer import (
    BookingAdminDetailSerializer,
)
from bookings_app.serializers.admin.admin_booking_create_serializer import (
    AdminBookingCreateSerializer,
)
from bookings_app.serializers.admin.admin_booking_update_serializer import (
    AdminBookingUpdateSerializer,
)
from users_app.permissions import HasCustomPermission


class AdminBookingViewSet(ModelViewSet):
    """
    Admin Booking APIs
    - List / Retrieve bookings
    - Create booking (with optional taaskr requests)
    - Cancel booking
    """

    queryset = Booking.objects.select_related(
        "customer",
        "service",
        "address",
    ).prefetch_related(
        "assignments__taaskr",
        "assignments__assigned_by",   # 🔥 THIS LINE FIXES IT
    ).order_by("-created_at")

    # ---------------------------
    # SERIALIZER
    # ---------------------------
    def get_serializer_class(self):
        if self.action == "create":
            return AdminBookingCreateSerializer
        if self.action == "retrieve":
            return BookingAdminDetailSerializer
        if self.action in ["update", "partial_update"]:  # ← Add this
            return AdminBookingUpdateSerializer
        return BookingAdminListSerializer

    # ---------------------------
    # PERMISSIONS
    # ---------------------------
    def get_permissions(self):
        permission_map = {
            "list": "booking.view",
            "retrieve": "booking.view",
            "create": "booking.create",
            "update": "booking.update",
            "partial_update": "booking.update",
            "destroy": "booking.delete",
        }

        HasCustomPermission.required_permissions = permission_map.get(
            self.action
        )
        return [IsAuthenticated(), HasCustomPermission()]

    # ---------------------------
    # LIST (Search + Filters)
    # ---------------------------
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        search = request.query_params.get("search")
        status_filter = request.query_params.get("status")
        assignment_status = request.query_params.get("assignment_status")

        if search:
            queryset = queryset.filter(
                Q(booking_code__icontains=search) |
                Q(customer__full_name__icontains=search) |
                Q(service__name__icontains=search)
            )

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        if assignment_status:
            queryset = queryset.filter(assignment_status=assignment_status)

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(
            page,
            many=True,
            context={"request": request}
        )
        return self.get_paginated_response(serializer.data)

    # ---------------------------
    # CANCEL BOOKING
    # ---------------------------

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()

        if booking.status == "completed":
            return Response(
                {"detail": "Completed booking cannot be cancelled"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.status = "cancelled"
        booking.save(update_fields=["status"])

        AssignmentLog.objects.filter(
            booking=booking,
            status="requested",
        ).update(status="cancelled")

        return Response({"detail": "Booking cancelled"})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": "Booking deleted successfully"},
            status=status.HTTP_200_OK,
        )
