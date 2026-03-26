import json
from rest_framework import serializers
from services_app.models import Service
from services_app.serializers.addon import AddonSerializer


class TextListField(serializers.Field):
    def to_representation(self, value):
        if value is None:
            return []
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            cleaned = value.strip()
            if not cleaned:
                return []
            try:
                parsed = json.loads(cleaned)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                pass
            return [item.strip() for item in cleaned.split(",") if item.strip()]
        return []

    def to_internal_value(self, data):
        if data in (None, ""):
            return ""
        if isinstance(data, list):
            return json.dumps(data)
        if isinstance(data, str):
            return data
        raise serializers.ValidationError("Expected a list or string.")


class ServiceSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, required=False)
    addons = serializers.SerializerMethodField()
    whats_included = TextListField(required=False)

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
