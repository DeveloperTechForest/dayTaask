# bookings_app/serializers/admin/quote_request_detail_serializer.py

from rest_framework import serializers
from bookings_app.models import QuoteRequest

from bookings_app.serializers.admin.quote_image_serializer import (
    QuoteImageSerializer
)


class AdminQuoteRequestDetailSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.full_name", read_only=True
    )
    customer_phone = serializers.CharField(
        source="customer.phone", read_only=True
    )
    category_name = serializers.SerializerMethodField()
    base_service_name = serializers.CharField(
        source="service.name", read_only=True
    )
    status = serializers.SerializerMethodField()

    images = QuoteImageSerializer(many=True, read_only=True)

    class Meta:
        model = QuoteRequest
        fields = [
            "id",
            "quote_code",
            "customer",
            "customer_name",
            "customer_phone",
            "service",
            "base_service_name",
            "service_category",
            "category_name",
            "service_name",
            "problem_description",
            "preferred_date",
            "preferred_time_slot",
            "status",
            "images",
            "booking",
            "created_at",
        ]

    def get_address_text(self, obj):
        if not obj.address:
            return None
        return str(obj.address)

    def get_category_name(self, obj):
        if obj.service_category:
            return obj.service_category.name
        if obj.service and obj.service.category:
            return obj.service.category.name
        return None

    def get_status(self, obj):
        if obj.booking and obj.booking.status == "completed":
            return "completed"
        if obj.booking and obj.booking.status == "started":
            return "in_progress"
        return obj.status
