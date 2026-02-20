# bookings_app/serializers/admin/quote_request_list_serializer.py

from rest_framework import serializers
from bookings_app.models import QuoteRequest


class AdminQuoteRequestListSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.full_name", read_only=True
    )
    category_name = serializers.CharField(
        source="service_category.name", read_only=True
    )
    base_service_name = serializers.CharField(
        source="service.name", read_only=True
    )

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
            "created_at",
        ]
