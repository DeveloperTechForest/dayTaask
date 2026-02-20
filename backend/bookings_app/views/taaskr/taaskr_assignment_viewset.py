# bookings_app/views/taaskr/taaskr_assignment_views.py

from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from bookings_app.models import AssignmentLog
from bookings_app.serializers.taaskr.taaskr_assignment_list_serializer import (
    TaaskrPendingAssignmentSerializer,
    TaaskrAssignmentHistorySerializer,
)
from bookings_app.serializers.taaskr.taaskr_assignment_action_serializer import (
    TaaskrAssignmentActionSerializer,
)

from users_app.permissions import HasCustomPermission   # assuming you have this


class TaaskrPendingAssignmentsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET only - shows only pending assignment requests for this taaskr
    """
    serializer_class = TaaskrPendingAssignmentSerializer
    permission_classes = [IsAuthenticated, HasCustomPermission]

    def get_queryset(self):
        return AssignmentLog.objects.filter(
            taaskr=self.request.user,
            status="requested",
            # Optional: hide requests that already expired
            expires_at__gt=timezone.now(),
        ).select_related(
            "booking",
            "booking__service",
            "booking__customer",
            "booking__address",
        ).annotate(
            # Count only accepted assignments for this booking
            accepted_count=Count(
                "booking__assignments",
                filter=Q(booking__assignments__status="accepted")
            )
        ).order_by("expires_at")  # soonest expiring first → good UX


class TaaskrAssignmentsHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET only - shows all past & current assignments for this taaskr
    """
    serializer_class = TaaskrAssignmentHistorySerializer
    permission_classes = [IsAuthenticated, HasCustomPermission]

    def get_queryset(self):
        return AssignmentLog.objects.filter(
            taaskr=self.request.user,
            status__in=["requested", "accepted",
                        "rejected", "cancelled", "expired"],
        ).select_related(
            "booking",
            "booking__service",
        ).order_by("-updated_at", "-created_at")


class TaaskrAssignmentActionViewSet(viewsets.GenericViewSet):
    """
    Only PATCH/PUT - accept or reject a specific assignment request
    """
    queryset = AssignmentLog.objects.none()
    serializer_class = TaaskrAssignmentActionSerializer
    permission_classes = [IsAuthenticated, HasCustomPermission]
    lookup_field = "pk"

    def get_object(self):
        obj = AssignmentLog.objects.filter(
            pk=self.kwargs["pk"],
            taaskr=self.request.user,
        ).select_related("booking").first()

        if not obj:
            self.permission_denied(self.request)

        return obj

    @action(detail=True, methods=["patch", "put"])
    def action(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()  # calls update()
        return Response(serializer.data)
