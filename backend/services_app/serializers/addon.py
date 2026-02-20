from rest_framework import serializers
from services_app.models import Addon


class AddonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Addon
        fields = ['id', 'name', 'price', 'description', 'is_active']
