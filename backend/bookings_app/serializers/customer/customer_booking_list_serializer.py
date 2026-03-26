from rest_framework import serializers
from bookings_app.models import Booking


class CustomerBookingListSerializer(serializers.ModelSerializer):
    service_name = serializers.SerializerMethodField()
    service_price = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_code",
            "service_name",
            "service_price",
            "scheduled_at",
            "status",
            "payment_status",
            "total_price",
            "created_at",
        ]

    def get_service_name(self, obj):
        if obj.custom_service:
            return obj.custom_service.name
        return obj.service.name if obj.service else ""

    def get_service_price(self, obj):
        if obj.custom_service:
            return obj.custom_service.base_price
        return obj.service.base_price if obj.service else 0
