# bookings_app/views/admin/booking_calendar_viewset.py

from django.db.models import Count, Q
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status

from bookings_app.models import Booking
from bookings_app.serializers.admin.booking_calendar_serializer import (
    BookingCalendarSerializer,
)
from users_app.permissions import HasCustomPermission


class AdminBookingCalendarViewSet(ReadOnlyModelViewSet):
    """
    Admin Calendar APIs
    - Month / Week calendar data
    - Optimized for calendar rendering
    """

    serializer_class = BookingCalendarSerializer
    pagination_class = None
    permission_classes = [IsAuthenticated, HasCustomPermission]

    def get_queryset(self):
        return (
            Booking.objects
            .select_related("customer", "service")
            .annotate(
                accepted_taaskr_count=Count(
                    "assignments",
                    filter=Q(assignments__status="accepted"),
                    distinct=True,
                )
            ).order_by("scheduled_at")
        )

    # ---------------------------
    # CALENDAR (MONTH / WEEK)
    # ---------------------------
    @action(detail=False, methods=["get"])
    def calendar(self, request):
        """
        Required query params:
        - start_date (YYYY-MM-DD)
        - end_date (YYYY-MM-DD)
        """

        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        if not start_date or not end_date:
            return Response(
                {"detail": "start_date and end_date are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queryset = (
            self.get_queryset()
            .filter(
                scheduled_at__date__gte=start_date,
                scheduled_at__date__lte=end_date,
            )
            .order_by("scheduled_at")
        )

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
