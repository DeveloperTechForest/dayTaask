from rest_framework import serializers
from django.db import transaction

from bookings_app.models import Booking, BookingAddon, CustomService
from services_app.models import Addon


class CustomerBookingCreateSerializer(serializers.ModelSerializer):

    addon_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        write_only=True
    )
    custom_service = serializers.PrimaryKeyRelatedField(
        queryset=CustomService.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Booking
        fields = [
            "id",
            "service",
            "custom_service",
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
        custom_service = validated_data.pop("custom_service", None)

        service = validated_data.get("service")
        if custom_service:
            service = custom_service.base_service or service
            validated_data["service"] = service

        if not service:
            raise serializers.ValidationError(
                {"service": "Service is required to create a booking."}
            )

        booking = Booking.objects.create(
            customer=request.user,
            total_price=custom_service.base_price if custom_service else service.base_price,
            payment_status="pending",
            paid_amount=0,
            status="pending",
            assignment_status="unassigned",
            custom_service=custom_service,
            **validated_data
        )

        total = custom_service.base_price if custom_service else service.base_price

        addons = Addon.objects.filter(id__in=addon_ids)

        for addon in addons:
            BookingAddon.objects.create(
                booking=booking,
                addon=addon
            )
            total += addon.price

        booking.total_price = total
        booking.save(update_fields=["total_price"])

        if custom_service:
            if custom_service.status != "accepted":
                custom_service.status = "accepted"
                custom_service.save(update_fields=["status"])
            quote = custom_service.quote_request
            if quote and quote.status != "accepted":
                quote.status = "accepted"
                quote.save(update_fields=["status"])

        return booking
