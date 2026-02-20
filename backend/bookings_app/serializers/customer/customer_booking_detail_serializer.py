from rest_framework import serializers
from bookings_app.models import Booking, BookingAddon


class BookingAddonSerializer(serializers.ModelSerializer):
    addon_name = serializers.CharField(source="addon.name", read_only=True)
    addon_price = serializers.DecimalField(
        source="addon.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = BookingAddon
        fields = [
            "id",
            "addon",
            "addon_name",
            "addon_price",
        ]


class CustomerBookingDetailSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source="service.name", read_only=True)
    service_price = serializers.DecimalField(
        source="service.base_price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    addons = BookingAddonSerializer(
        source="bookingaddon_set",
        many=True,
        read_only=True
    )

    class Meta:
        model = Booking
        fields = "__all__"
