# bookings_app/serializers/admin/quote_image_serializer.py

from rest_framework import serializers
from bookings_app.models import QuoteImage


class QuoteImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteImage
        fields = [
            "id",
            "image",
            "uploaded_by",
            "created_at",
        ]
        read_only_fields = ["id", "uploaded_by", "created_at"]
