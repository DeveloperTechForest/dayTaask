# bookings_app/views/admin/admin_assignment_action_viewset.py

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from bookings_app.models import AssignmentLog, Booking
from bookings_app.serializers.admin.assign_taaskr_serializer import (
    AssignTaaskrSerializer
)
from users_app.permissions import HasCustomPermission


class AdminAssignmentActionViewSet(ModelViewSet):
    """
    Admin assignment ACTIONS
    - POST → send assignment requests
    """

    serializer_class = AssignTaaskrSerializer
    permission_classes = [IsAuthenticated, HasCustomPermission]
    required_permissions = ["booking.assign"]

    def get_queryset(self):
        return AssignmentLog.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"detail": "Assignment request(s) sent successfully"},
            status=status.HTTP_201_CREATED
        )
