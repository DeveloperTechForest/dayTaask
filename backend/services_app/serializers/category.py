from rest_framework import serializers
from services_app.models import Category


class CategorySerializer(serializers.ModelSerializer):
    icon = serializers.ImageField(use_url=True, required=False)
    banner = serializers.ImageField(use_url=True, required=False)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'banner', 'is_active']
