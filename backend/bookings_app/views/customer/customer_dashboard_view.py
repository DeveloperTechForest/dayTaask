from django.utils import timezone
from django.db.models import Count, Sum

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from bookings_app.models import Booking
from bookings_app.serializers.customer.customer_dashboard_serializer import (
    CustomerDashboardSerializer,
)


class CustomerDashboardAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user
        now = timezone.now()

        base_qs = Booking.objects.select_related(
            "service",
            "custom_service",
            "address"
        ).filter(customer=user)

        # ACTIVE
        active_qs = base_qs.filter(
            status__in=["pending", "confirmed", "started"]
        ).order_by("scheduled_at")

        # PAST
        past_qs = base_qs.filter(
            status__in=["completed", "cancelled"]
        ).order_by("-scheduled_at")[:5]

        # ---------------- STATS ----------------

        active_count = active_qs.count()
        total_services = base_qs.count()

        # Most booked service (we will improve below)
        most_booked = (
            base_qs.values("service__name")
            .annotate(count=Count("id"))
            .order_by("-count")
            .first()
        )

        most_booked_service = (
            most_booked["service__name"]
            if most_booked else None
        )

        saved_this_year = (
            base_qs.filter(
                status="completed",
                created_at__year=now.year
            ).aggregate(total=Sum("total_price"))["total"] or 0
        )

        serializer = CustomerDashboardSerializer({
            "stats": {
                "active_bookings": active_count,
                "most_booked_service": most_booked_service,
                "total_services": total_services,
                "saved_this_year": saved_this_year,
            },
            "active_bookings": active_qs,
            "past_bookings": past_qs,
        })

        return Response(serializer.data)
