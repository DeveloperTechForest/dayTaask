from rest_framework import serializers
from bookings_app.models import QuoteRequest


class CustomerQuoteRequestListSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    custom_service_id = serializers.SerializerMethodField()
    custom_service_name = serializers.SerializerMethodField()
    custom_service_status = serializers.SerializerMethodField()
    booking_id = serializers.SerializerMethodField()
    booking_status = serializers.SerializerMethodField()
    booking_payment_status = serializers.SerializerMethodField()

    class Meta:
        model = QuoteRequest
        fields = [
            "id",
            "quote_code",
            "service_name",
            "service",
            "service_category",
            "category_name",
            "preferred_date",
            "preferred_time_slot",
            "status",
            "custom_service_id",
            "custom_service_name",
            "custom_service_status",
            "booking_id",
            "booking_status",
            "booking_payment_status",
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

    def get_custom_service_status(self, obj):
        cs = self._get_custom_service(obj)
        return cs.status if cs else None

    def get_booking_id(self, obj):
        return obj.booking.id if obj.booking else None

    def get_booking_status(self, obj):
        return obj.booking.status if obj.booking else None

    def get_booking_payment_status(self, obj):
        return obj.booking.payment_status if obj.booking else None
