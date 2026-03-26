from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta

from bookings_app.models import AssignmentLog
from taaskr_app.models.profile import TaaskrProfile
from taaskr_app.models.availability import Availability


class TaaskrDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = TaaskrProfile.objects.filter(user=user).first()
        availability = Availability.objects.filter(taaskr=user).order_by("-updated_at").first()
        is_online = availability.is_available if availability else True

        pending_qs = AssignmentLog.objects.filter(
            taaskr=user,
            status="requested",
            booking__status__in=["pending", "confirmed", "started"],
        ).select_related(
            "booking",
            "booking__service",
            "booking__customer",
            "booking__address",
        ).order_by("-created_at")[:5]

        upcoming_qs = AssignmentLog.objects.filter(
            taaskr=user,
            status="accepted",
            booking__status__in=["pending", "confirmed", "started"],
        ).select_related(
            "booking",
            "booking__service",
            "booking__customer",
            "booking__address",
        ).order_by("booking__scheduled_at")[:5]

        def location_short(booking):
            if not booking.address:
                return "-"
            parts = [booking.address.city, booking.address.state]
            return ", ".join([p for p in parts if p]) or "-"

        def job_payload(log, status_override=None):
            booking = log.booking
            return {
                "id": log.id,
                "booking_id": booking.id,
                "service_name": booking.service.name if booking.service else "-",
                "customer_name": booking.customer.full_name if booking.customer else "-",
                "location": location_short(booking),
                "distance": "-",
                "date_time": booking.scheduled_at,
                "earnings": booking.total_price,
                "status": status_override or log.status,
                "booking_status": booking.status,
            }

        recent_requests = [job_payload(log, "incoming") for log in pending_qs]
        upcoming_jobs = [job_payload(log, "accepted") for log in upcoming_qs]

        accepted_logs = AssignmentLog.objects.filter(
            taaskr=user, status="accepted"
        ).select_related("booking")

        completed_count = accepted_logs.filter(
            booking__status="completed"
        ).count()

        today = timezone.localdate()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)

        jobs_today = accepted_logs.filter(
            booking__scheduled_at__date=today
        ).count()

        jobs_week = accepted_logs.filter(
            booking__scheduled_at__date__range=(week_start, week_end)
        ).count()

        total_requests = AssignmentLog.objects.filter(
            taaskr=user
        ).count()
        acceptance_rate = (
            int((accepted_logs.count() / total_requests) * 100)
            if total_requests > 0
            else 0
        )

        data = {
            "availability": {
                "is_online": is_online,
            },
            "stats": {
                "jobs_today": jobs_today,
                "jobs_week": jobs_week,
                "jobs_done": completed_count,
                "rating_avg": profile.rating_avg if profile else 0,
                "acceptance_rate": acceptance_rate,
            },
            "recent_requests": recent_requests,
            "upcoming_jobs": upcoming_jobs,
            "notifications": [],
        }

        return Response(data)
