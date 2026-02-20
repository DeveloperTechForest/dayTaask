from rest_framework.viewsets import ReadOnlyModelViewSet
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

        return Booking.objects.select_related(
            "customer", "service", "address"
        ).prefetch_related(
            "assignments"
        ).filter(
            assignment_status__in=["unassigned",
                                   "requested", "partially_assigned"]
        ).exclude(
            status__in=["cancelled", "completed"]
        ).order_by("-created_at")

    def get_permissions(self):
        return [IsAuthenticated(), HasCustomPermission()]
