from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated
from bookings_app.models import AssignmentLog
from bookings_app.serializers.admin.assignment_list_serializer import (
    AssignmentListSerializer,
)
from users_app.permissions import HasCustomPermission


class AdminAssignmentViewSet(ReadOnlyModelViewSet):
    """
    View assignment history
    """

    queryset = (
        AssignmentLog.objects
        .select_related("booking", "taaskr")
        .order_by("-created_at")
    )

    serializer_class = AssignmentListSerializer

    def get_permissions(self):
        permission_classes = [IsAuthenticated, HasCustomPermission]
        HasCustomPermission.required_permissions = "booking.assign"
        return [permission() for permission in permission_classes]
