from rest_framework import serializers
from services_app.models import Service
from services_app.serializers.addon import AddonSerializer


class ServiceSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, required=False)
    addons = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            'id', 'category', 'name', 'short_description', 'description',
            'base_price', 'price_unit', 'duration_minutes', 'image',
            'warranty_days', 'addons', 'is_active', 'whats_included',
        ]

    def get_addons(self, obj):
        addons_qs = obj.addons.filter(is_active=True)
        return AddonSerializer(addons_qs, many=True).data
