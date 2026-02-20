# taaskr_app/views/taaskrAvailability.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from taaskr_app.models.availability import Availability
from taaskr_app.serializers.taaskr_availability_serializer import AvailabilitySerializer
from users_app.permissions import HasCustomPermission


class AvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Only return availability for the current authenticated taaskr"""
        return Availability.objects.filter(taaskr=self.request.user)

    def get_permissions(self):
        """Apply custom permissions based on action"""
        if self.action in ["list", "retrieve"]:
            HasCustomPermission.required_permissions = "taaskr_availability.view"
            return [IsAuthenticated(), HasCustomPermission()]
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            HasCustomPermission.required_permissions = "taaskr_availability.change"
            return [IsAuthenticated(), HasCustomPermission()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        """Ensure taaskr is set to current user"""
        serializer.save(taaskr=self.request.user)

    @action(detail=False, methods=["get"], url_path="my-schedule")
    def my_schedule(self, request):
        """GET /api/taaskr/admin/availability/my-schedule/"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path="bulk-update")
    def bulk_update(self, request):
        """Bulk update availability (perfect for calendar UI)"""
        if not isinstance(request.data, list):
            return Response(
                {"error": "Expected a list of availability objects"},
                status=400,
            )

        updated = []
        errors = []

        for item in request.data:
            instance_id = item.get("id")
            if instance_id:
                try:
                    availability = Availability.objects.get(
                        id=instance_id, taaskr=request.user
                    )
                    serializer = self.get_serializer(
                        availability, data=item, partial=True
                    )
                except Availability.DoesNotExist:
                    errors.append(
                        {"id": instance_id, "error": "Not found or not owned"})
                    continue
            else:
                serializer = self.get_serializer(data=item)

            if serializer.is_valid():
                serializer.save(taaskr=request.user)
                updated.append(serializer.data)
            else:
                errors.append({"data": item, "errors": serializer.errors})

        return Response({"updated": updated, "errors": errors})
