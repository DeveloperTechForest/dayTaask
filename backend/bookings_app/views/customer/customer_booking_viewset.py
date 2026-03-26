# bookings_app/views/customer/customer_booking_viewset.py

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from bookings_app.models import Booking
from bookings_app.serializers.customer.customer_booking_create_serializer import (
    CustomerBookingCreateSerializer,
)
from bookings_app.serializers.customer.customer_booking_list_serializer import (
    CustomerBookingListSerializer,
)
from bookings_app.serializers.customer.customer_booking_detail_serializer import (
    CustomerBookingDetailSerializer,
)
from users_app.serializers.verification import generate_otp


class CustomerBookingViewSet(ModelViewSet):
    """
    Customer Booking APIs
    - Create booking
    - View own bookings
    - Cancel booking
    """

    queryset = Booking.objects.select_related(
        "service",
        "address",
    ).prefetch_related(
        "bookingaddon_set__addon",
        "media",
    ).order_by("-created_at")

    # ---------------------------
    # SERIALIZER
    # ---------------------------
    def get_serializer_class(self):
        if self.action == "create":
            return CustomerBookingCreateSerializer
        if self.action == "retrieve":
            return CustomerBookingDetailSerializer
        return CustomerBookingListSerializer

    # ---------------------------
    # PERMISSIONS
    # ---------------------------
    def get_permissions(self):
        return [IsAuthenticated()]

    # ---------------------------
    # LIMIT TO OWN BOOKINGS
    # ---------------------------
    def get_queryset(self):
        return self.queryset.filter(customer=self.request.user)

    # ---------------------------
    # CANCEL BOOKING
    # ---------------------------
    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()

        if booking.status in ["completed", "cancelled"]:
            return Response(
                {"detail": "Booking cannot be cancelled"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.status = "cancelled"
        booking.save(update_fields=["status"])

        return Response({"detail": "Booking cancelled successfully"})

    @action(detail=True, methods=["post"], url_path="custom-service/action")
    def custom_service_action(self, request, pk=None):
        booking = self.get_object()

        if not booking.custom_service:
            return Response(
                {"detail": "No custom service found for this booking"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        action = request.data.get("action")
        if action not in ["accept", "reject"]:
            return Response(
                {"detail": "Invalid action"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        custom_service = booking.custom_service

        if custom_service.status != "sent":
            return Response(
                {"detail": "Custom service is not awaiting approval"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if action == "accept":
            custom_service.status = "accepted"
            custom_service.save(update_fields=["status"])
            booking.total_price = custom_service.base_price
            booking.save(update_fields=["total_price"])
            return Response({"detail": "Custom service accepted"})

        # reject
        custom_service.status = "cancelled"
        custom_service.save(update_fields=["status"])
        booking.custom_service = None
        booking.total_price = booking.service.base_price if booking.service else 0
        booking.save(update_fields=["custom_service", "total_price"])
        return Response({"detail": "Custom service rejected"})

    @action(detail=True, methods=["get"], url_path="start-otp")
    def start_otp(self, request, pk=None):
        booking = self.get_object()

        if booking.assignment_status != "assigned":
            return Response(
                {"detail": "Taaskr not assigned yet"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if booking.status not in ["confirmed", "started"]:
            return Response(
                {"detail": "Booking is not ready to start"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not booking.start_otp:
            booking.start_otp = generate_otp()
            booking.save(update_fields=["start_otp"])

        return Response({"start_otp": booking.start_otp})

    @action(detail=True, methods=["get"], url_path="completion-otp")
    def completion_otp(self, request, pk=None):
        booking = self.get_object()

        if booking.status not in ["started", "completed"]:
            return Response(
                {"detail": "Booking is not in progress"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not booking.completion_requested_at:
            return Response(
                {"detail": "Completion has not been requested"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if booking.payment_status not in ["paid", "cod_pending"]:
            return Response(
                {"detail": "Payment is pending"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not booking.completion_otp:
            booking.completion_otp = generate_otp()
            booking.save(update_fields=["completion_otp"])

        return Response({"completion_otp": booking.completion_otp})
