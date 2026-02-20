# bookings_app/views/admin/assignment_viewset.py

from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated

from bookings_app.models import AssignmentLog, Booking
from bookings_app.serializers.admin.assignment_list_serializer import (
    AssignmentListSerializer,
)
from users_app.permissions import HasCustomPermission


class AdminAssignmentViewSet(ReadOnlyModelViewSet):
    """
    Admin assignment audit logs
    - List all assignment logs (audit)
    - Filter by booking: ?booking=<id>
    - Cancel a specific pending request
    """

    queryset = AssignmentLog.objects.select_related(
        "booking",
        "taaskr",
        "assigned_by",
    ).order_by("-created_at")

    serializer_class = AssignmentListSerializer

    def get_permissions(self):
        HasCustomPermission.required_permissions = "booking.assign"
        return [IsAuthenticated(), HasCustomPermission()]

    def get_queryset(self):
        qs = super().get_queryset()
        booking_id = self.request.query_params.get("booking")
        if booking_id:
            qs = qs.filter(booking_id=booking_id)
        return qs

    @action(detail=True, methods=["patch"], url_path="cancel")
    def cancel_request(self, request, pk=None):
        """
        Cancel a specific assignment request (only if still 'requested')
        """
        try:
            log = self.get_object()
        except AssignmentLog.DoesNotExist:
            return Response({"detail": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

        if log.status != "requested":
            return Response(
                {"detail": "Only pending (requested) assignments can be cancelled"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if log.expires_at and log.expires_at < timezone.now():
            return Response(
                {"detail": "This request has already expired"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        log.status = "cancelled"
        log.save(update_fields=["status"])

        # Optional: check if booking still needs more taaskrs
        # If needed, you can update booking.assignment_status here

        return Response({
            "detail": "Assignment request cancelled",
            "assignment_id": log.id,
            "new_status": log.status
        })
