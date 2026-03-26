from rest_framework import serializers
from bookings_app.models import QuoteRequest
from bookings_app.serializers.admin.quote_image_serializer import QuoteImageSerializer


class CustomerQuoteRequestDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    images = QuoteImageSerializer(many=True, read_only=True)
    custom_service_id = serializers.SerializerMethodField()
    custom_service_name = serializers.SerializerMethodField()
    custom_service_description = serializers.SerializerMethodField()
    custom_service_price = serializers.SerializerMethodField()
    custom_service_price_unit = serializers.SerializerMethodField()
    custom_service_duration_minutes = serializers.SerializerMethodField()
    custom_service_warranty_days = serializers.SerializerMethodField()
    custom_service_status = serializers.SerializerMethodField()

    class Meta:
        model = QuoteRequest
        fields = [
            "id",
            "quote_code",
            "service_name",
            "service",
            "service_category",
            "category_name",
            "problem_description",
            "preferred_date",
            "preferred_time_slot",
            "status",
            "images",
            "custom_service_id",
            "custom_service_name",
            "custom_service_description",
            "custom_service_price",
            "custom_service_price_unit",
            "custom_service_duration_minutes",
            "custom_service_warranty_days",
            "custom_service_status",
            "booking",
            "created_at",
        ]

    def get_category_name(self, obj):
        if obj.service_category:
            return obj.service_category.name
        if obj.service and obj.service.category:
            return obj.service.category.name
        return None

    def _get_custom_service(self, obj):
        return getattr(obj, "custom_service", None)

    def get_custom_service_id(self, obj):
        cs = self._get_custom_service(obj)
        return cs.id if cs else None

    def get_custom_service_name(self, obj):
        cs = self._get_custom_service(obj)
        return cs.name if cs else None

    def get_custom_service_description(self, obj):
        cs = self._get_custom_service(obj)
        return cs.description if cs else None

    def get_custom_service_price(self, obj):
        cs = self._get_custom_service(obj)
        return cs.base_price if cs else None

    def get_custom_service_price_unit(self, obj):
        cs = self._get_custom_service(obj)
        return cs.price_unit if cs else None

    def get_custom_service_duration_minutes(self, obj):
        cs = self._get_custom_service(obj)
        return cs.duration_minutes if cs else None

    def get_custom_service_warranty_days(self, obj):
        cs = self._get_custom_service(obj)
        return cs.warranty_days if cs else None

    def get_custom_service_status(self, obj):
        cs = self._get_custom_service(obj)
        return cs.status if cs else None
