# taaskr_app/serializers/service_area_serializer.py
from rest_framework import serializers
from taaskr_app.models.service_area import ServiceArea


class ServiceAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceArea
        fields = [
            "id",
            "name",
            "city",
            "state",
            "radius_km",
            "is_active",
            "created_at",
            "updated_at",
        ]
