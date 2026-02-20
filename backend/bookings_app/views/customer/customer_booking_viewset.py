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
