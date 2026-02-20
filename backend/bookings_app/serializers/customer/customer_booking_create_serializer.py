from rest_framework import serializers
from django.db import transaction

from bookings_app.models import Booking, BookingAddon
from services_app.models import Addon


class CustomerBookingCreateSerializer(serializers.ModelSerializer):

    addon_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        write_only=True
    )

    class Meta:
        model = Booking
        fields = [
            "id",
            "service",
            "address",
            "scheduled_at",
            "required_taaskrs",
            "location_notes",
            "addon_ids",
        ]
        read_only_fields = ["id"]

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]
        addon_ids = validated_data.pop("addon_ids", [])

        service = validated_data["service"]

        # 🔹 Create booking
        booking = Booking.objects.create(
            customer=request.user,
            total_price=service.base_price,
            payment_status="pending",
            paid_amount=0,
            status="pending",
            assignment_status="unassigned",
            **validated_data
        )

        total = service.base_price

        # 🔹 Add addons
        addons = Addon.objects.filter(id__in=addon_ids)

        for addon in addons:
            BookingAddon.objects.create(
                booking=booking,
                addon=addon
            )
            total += addon.price

        booking.total_price = total
        booking.save(update_fields=["total_price"])

        return booking
