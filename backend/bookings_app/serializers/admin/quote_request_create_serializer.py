# bookings_app/serializers/admin/quote_request_create_serializer.py

from rest_framework import serializers
from bookings_app.models import QuoteRequest, QuoteImage
from users_app.models import User


class AdminQuoteRequestCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = QuoteRequest
        fields = [
            "customer",
            "service",
            "service_category",
            "service_name",
            "problem_description",
            "preferred_date",
            "preferred_time_slot",
            "status",
            "images",
        ]

    def validate_customer(self, value):
        if not value.is_active:
            raise serializers.ValidationError("Customer must be active")
        return value

    def create(self, validated_data):
        images = validated_data.pop("images", [])

        quote = QuoteRequest.objects.create(**validated_data)

        # 🖼️ Attach images
        for image in images:
            QuoteImage.objects.create(
                quote_request=quote,
                image=image,
                uploaded_by="admin",
            )

        return quote
