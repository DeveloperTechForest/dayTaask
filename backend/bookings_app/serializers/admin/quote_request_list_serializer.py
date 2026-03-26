# bookings_app/serializers/admin/quote_request_list_serializer.py

from rest_framework import serializers
from bookings_app.models import QuoteRequest


class AdminQuoteRequestListSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.full_name", read_only=True
    )
    category_name = serializers.SerializerMethodField()
    base_service_name = serializers.CharField(
        source="service.name", read_only=True
    )
    status = serializers.SerializerMethodField()

    class Meta:
        model = QuoteRequest
        fields = [
            "id",
            "quote_code",
            "customer_name",
            "service_name",
            "service",
            "base_service_name",
            "category_name",
            "preferred_date",
            "preferred_time_slot",
            "status",
            "custom_service",
            "created_at",
        ]

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
