# bookings_app/serializers/customer/customer_dashboard_serializer.py

from rest_framework import serializers
from django.utils import timezone

from bookings_app.models import Booking


# ---------------------------
# ADDRESS SERIALIZER
# ---------------------------

class DashboardAddressSerializer(serializers.Serializer):
    full_address = serializers.SerializerMethodField()

    def get_full_address(self, obj):
        if not obj.address:
            return None

        return f"{obj.address.street}, {obj.address.city}, {obj.address.state} - {obj.address.pincode}"


# ---------------------------
# BOOKING ITEM SERIALIZER
# ---------------------------

class DashboardBookingSerializer(serializers.ModelSerializer):

    service_name = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_code",
            "service_name",
            "scheduled_at",
            "status",
            "total_price",
            "address",
        ]

    def get_service_name(self, obj):
        if obj.custom_service:
            return obj.custom_service.name
        return obj.service.name

    def get_address(self, obj):
        if not obj.address:
            return None
        address = obj.address
        return f"{address.label} - {address.street}, {address.city}, {address.state} - {address.pincode}"


# ---------------------------
# MAIN DASHBOARD SERIALIZER
# ---------------------------

class CustomerDashboardSerializer(serializers.Serializer):
    stats = serializers.DictField()
    active_bookings = DashboardBookingSerializer(many=True)
    past_bookings = DashboardBookingSerializer(many=True)
