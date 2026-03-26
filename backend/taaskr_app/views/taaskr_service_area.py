# taaskr_app/views/taaskr_service_area.py
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from taaskr_app.models.service_area import ServiceArea, TaaskrServiceArea
from taaskr_app.models.profile import TaaskrProfile
from taaskr_app.serializers.service_area_serializer import ServiceAreaSerializer


class ServiceAreaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ServiceAreaSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return ServiceArea.objects.filter(is_active=True)

    @action(detail=False, methods=["get", "post"], permission_classes=[IsAuthenticated], url_path="selected")
    def selected(self, request):
        profile = TaaskrProfile.objects.filter(user=request.user).first()
        if not profile:
            return Response({"detail": "Taaskr profile not found"}, status=404)

        if request.method.lower() == "get":
            areas = ServiceArea.objects.filter(taaskr_links__taaskr=request.user)
            serializer = self.get_serializer(areas, many=True)
            return Response(serializer.data)

        # POST: set selected areas by ids
        area_ids = request.data.get("area_ids", [])
        if not isinstance(area_ids, list):
            return Response({"detail": "area_ids must be a list"}, status=400)

        areas = ServiceArea.objects.filter(id__in=area_ids, is_active=True)
        existing_ids = set(
            TaaskrServiceArea.objects.filter(
                taaskr=request.user, service_area_id__in=area_ids
            ).values_list("service_area_id", flat=True)
        )

        for area in areas:
            if area.id not in existing_ids:
                TaaskrServiceArea.objects.create(
                    taaskr=request.user,
                    service_area=area,
                )

        TaaskrServiceArea.objects.filter(taaskr=request.user).exclude(
            service_area_id__in=area_ids
        ).delete()

        selected_areas = ServiceArea.objects.filter(
            taaskr_links__taaskr=request.user
        )
        serializer = self.get_serializer(selected_areas, many=True)
        return Response(serializer.data)
