from rest_framework.viewsets import ReadOnlyModelViewSet
from django.db.models import Q
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated

from bookings_app.models import Booking
from bookings_app.serializers.admin.needy_assignment_serializer import NeedyAssignmentSerializer
from users_app.permissions import HasCustomPermission


class NeedyAssignmentViewSet(ReadOnlyModelViewSet):
    """
    Returns ONLY bookings that still need taaskrs.
    Used by Assignment Management page.
    """
    serializer_class = NeedyAssignmentSerializer
    permission_classes = [IsAuthenticated, HasCustomPermission]

    def get_queryset(self):
        HasCustomPermission.required_permissions = "booking.view"

        qs = Booking.objects.select_related(
            "customer", "service", "address"
        ).prefetch_related(
            "assignments"
        ).filter(
            assignment_status__in=["unassigned",
                                   "requested", "partially_assigned"]
        ).exclude(
            status__in=["cancelled", "completed"]
        ).exclude(
            scheduled_at__lt=timezone.now(),
            status__in=["pending", "confirmed"]
        ).order_by("-created_at")

        search = self.request.query_params.get("search")
        assignment_status = self.request.query_params.get("assignment_status")
        is_urgent = self.request.query_params.get("is_urgent")

        if search:
            qs = qs.filter(
                Q(booking_code__icontains=search) |
                Q(customer__full_name__icontains=search) |
                Q(service__name__icontains=search)
            )

        if assignment_status:
            qs = qs.filter(assignment_status=assignment_status)

        if is_urgent == "true":
            qs = qs.filter(
                scheduled_at__lte=timezone.now() + timezone.timedelta(hours=24)
            )

        return qs

    def get_permissions(self):
        return [IsAuthenticated(), HasCustomPermission()]
