from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from bookings_app.models import Booking, AssignmentLog, BookingMedia
from bookings_app.serializers.taaskr.taaskr_booking_detail_serializer import (
    TaaskrBookingDetailSerializer,
)


def _get_assigned_log(booking_id, user):
    return AssignmentLog.objects.filter(
        booking_id=booking_id, taaskr=user, status="accepted"
    ).first()


class TaaskrStartServiceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        booking = Booking.objects.filter(id=booking_id).first()
        if not booking:
            return Response({"detail": "Booking not found"}, status=404)

        log = _get_assigned_log(booking_id, request.user)
        if not log:
            return Response({"detail": "Not assigned to this booking"}, status=403)

        if booking.custom_service and booking.custom_service.status == "sent":
            return Response(
                {"detail": "Customer approval pending for service change"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if booking.status != "confirmed":
            return Response(
                {"detail": "Booking is not ready to start"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        otp = str(request.data.get("otp", "")).strip()
        if not booking.start_otp or otp != booking.start_otp:
            return Response({"detail": "Invalid OTP"}, status=400)

        booking.status = "started"
        booking.started_at = timezone.now()
        booking.save(update_fields=["status", "started_at"])

        serializer = TaaskrBookingDetailSerializer(
            booking, context={"assignment_log": log, "request": request}
        )
        return Response(serializer.data)


class TaaskrBookingMediaUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        booking = Booking.objects.filter(id=booking_id).first()
        if not booking:
            return Response({"detail": "Booking not found"}, status=404)

        log = _get_assigned_log(booking_id, request.user)
        if not log:
            return Response({"detail": "Not assigned to this booking"}, status=403)

        stage = request.data.get("stage")
        media_type = request.data.get("media_type")
        if stage not in ["before", "after"]:
            return Response({"detail": "Invalid stage"}, status=400)
        if media_type not in ["photo", "audio"]:
            return Response({"detail": "Invalid media type"}, status=400)

        if stage == "before" and booking.status not in ["confirmed", "started"]:
            return Response(
                {"detail": "Before media allowed only before service starts"},
                status=400,
            )
        if stage == "after" and booking.status != "started":
            return Response(
                {"detail": "After media allowed only after service starts"},
                status=400,
            )

        files = request.FILES.getlist("files") or []
        if not files and request.FILES.get("file"):
            files = [request.FILES.get("file")]
        if not files:
            return Response({"detail": "No files uploaded"}, status=400)

        created = []
        for file in files:
            created.append(
                BookingMedia.objects.create(
                    booking=booking,
                    stage=stage,
                    media_type=media_type,
                    file=file,
                    uploaded_by="taaskr",
                )
            )

        return Response(
            {"detail": "Uploaded", "count": len(created)},
            status=status.HTTP_201_CREATED,
        )


class TaaskrCompletionRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        booking = Booking.objects.filter(id=booking_id).first()
        if not booking:
            return Response({"detail": "Booking not found"}, status=404)

        log = _get_assigned_log(booking_id, request.user)
        if not log:
            return Response({"detail": "Not assigned to this booking"}, status=403)

        if booking.status != "started":
            return Response(
                {"detail": "Booking is not in progress"},
                status=400,
            )

        if not booking.completion_requested_at:
            booking.completion_requested_at = timezone.now()
            booking.save(update_fields=["completion_requested_at"])

        return Response({"detail": "Completion requested"})


class TaaskrCompleteServiceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        booking = Booking.objects.filter(id=booking_id).first()
        if not booking:
            return Response({"detail": "Booking not found"}, status=404)

        log = _get_assigned_log(booking_id, request.user)
        if not log:
            return Response({"detail": "Not assigned to this booking"}, status=403)

        if booking.status != "started":
            return Response(
                {"detail": "Booking is not in progress"},
                status=400,
            )

        if not booking.completion_requested_at:
            return Response(
                {"detail": "Completion has not been requested"},
                status=400,
            )

        if booking.payment_status not in ["paid", "cod_pending"]:
            return Response(
                {"detail": "Payment is pending"},
                status=400,
            )

        otp = str(request.data.get("otp", "")).strip()
        if not booking.completion_otp or otp != booking.completion_otp:
            return Response({"detail": "Invalid OTP"}, status=400)

        booking.status = "completed"
        booking.completed_at = timezone.now()
        booking.save(update_fields=["status", "completed_at"])

        serializer = TaaskrBookingDetailSerializer(
            booking, context={"assignment_log": log, "request": request}
        )
        return Response(serializer.data)
