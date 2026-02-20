from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated

from users_app.models import User
from taaskr_app.serializers.admin.taaskr_admin_list_serializer import TaaskrAdminListSerializer
from users_app.permissions import HasCustomPermission


class TaaskrAdminListViewSet(ReadOnlyModelViewSet):
    """
    Admin: List of all taaskrs with rich data
    Used in Assignment page for selection
    """
    serializer_class = TaaskrAdminListSerializer
    permission_classes = [IsAuthenticated, HasCustomPermission]

    def get_queryset(self):
        HasCustomPermission.required_permissions = "booking.assign"
        # Only users with TaaskrProfile
        return User.objects.filter(taaskrprofile__isnull=False).select_related(
            "taaskrprofile"
        ).prefetch_related(
            "availabilities"
        ).order_by("-taaskrprofile__rating_avg", "full_name")

    def get_permissions(self):
        return [IsAuthenticated(), HasCustomPermission()]
