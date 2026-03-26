from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from bookings_app.models import AssignmentLog
from bookings_app.serializers.taaskr.taaskr_booking_detail_serializer import (
    TaaskrBookingDetailSerializer,
)
class TaaskrBookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):
        log = AssignmentLog.objects.filter(
            booking_id=booking_id,
            taaskr=request.user,
        ).select_related(
            "booking",
            "booking__service",
            "booking__customer",
            "booking__address",
        ).prefetch_related(
            "booking__media",
        ).first()

        if not log:
            return Response(
                {"detail": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = TaaskrBookingDetailSerializer(
            log.booking, context={"assignment_log": log, "request": request}
        )
        return Response(serializer.data)
