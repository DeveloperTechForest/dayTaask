from rest_framework import serializers
from services_app.models.service import Service


class AdminServiceSerializer(serializers.ModelSerializer):
    # Read-only category name (for listing & detail)
    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    class Meta:
        model = Service
        fields = [
            "id",
            "name",
            "short_description",
            "description",
            "category",        # <-- FK ID (used for create/update)
            "category_name",   # <-- display only
            "base_price",
            "price_unit",
            "duration_minutes",
            "image",
            "warranty_days",
            "whats_included",
            "slug",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
