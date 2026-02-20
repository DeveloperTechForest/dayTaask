from rest_framework import serializers
from services_app.models.addon import Addon


class AddonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Addon
        fields = '__all__'
