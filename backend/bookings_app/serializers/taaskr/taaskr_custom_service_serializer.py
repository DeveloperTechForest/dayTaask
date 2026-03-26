from rest_framework import serializers
from django.utils import timezone
from bookings_app.models import Booking, CustomService, QuoteRequest
from services_app.serializers.service import TextListField
from taaskr_app.serializers.taaskr_serializer import _parse_text_list


class TaaskrCustomServiceCreateSerializer(serializers.Serializer):
    booking_id = serializers.PrimaryKeyRelatedField(queryset=Booking.objects.all())
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    base_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    price_unit = serializers.ChoiceField(
        choices=[("fixed", "Fixed"), ("hourly", "Hourly"), ("custom", "Custom")]
    )
    whats_included = TextListField(required=False)
    duration_minutes = serializers.IntegerField(required=False, min_value=1)
    warranty_days = serializers.IntegerField(required=False, min_value=0)

    def create(self, validated_data):
        request = self.context["request"]
        booking = validated_data["booking_id"]

        if booking.status in ["started", "completed", "cancelled"]:
            raise serializers.ValidationError(
                "Service change not allowed for this booking status"
            )

        if booking.custom_service and booking.custom_service.status in [
            "sent",
            "accepted",
            "in_progress",
        ]:
            raise serializers.ValidationError(
                "A service change is already pending for this booking"
            )

        quote = QuoteRequest.objects.filter(booking=booking).first()
        if not quote:
            scheduled_at = booking.scheduled_at
            local_dt = timezone.localtime(scheduled_at) if scheduled_at else None
            quote = QuoteRequest.objects.create(
                customer=booking.customer,
                service=booking.service,
                service_category=booking.service.category if booking.service else None,
                service_name=booking.service.name if booking.service else "Service",
                problem_description=validated_data.get("description")
                or booking.location_notes
                or "On-site change request",
                preferred_date=local_dt.date() if local_dt else None,
                preferred_time_slot=local_dt.strftime("%I:%M %p") if local_dt else "",
                status="quoted",
                booking=booking,
            )
        else:
            updated = False
            if not quote.service_category and booking.service and booking.service.category:
                quote.service_category = booking.service.category
                updated = True
            if not quote.preferred_date and booking.scheduled_at:
                local_dt = timezone.localtime(booking.scheduled_at)
                quote.preferred_date = local_dt.date()
                updated = True
            if (not quote.preferred_time_slot) and booking.scheduled_at:
                local_dt = timezone.localtime(booking.scheduled_at)
                quote.preferred_time_slot = local_dt.strftime("%I:%M %p")
                updated = True
            if updated:
                quote.save(update_fields=[
                    "service_category",
                    "preferred_date",
                    "preferred_time_slot",
                ])

        whats_included = validated_data.get("whats_included", "")
        parsed_whats_included = _parse_text_list(whats_included)

        custom_service = CustomService.objects.create(
            quote_request=quote,
            base_service=booking.service,
            created_by=request.user,
            status="sent",
            name=validated_data["name"],
            description=validated_data.get("description", ""),
            base_price=validated_data["base_price"],
            price_unit=validated_data["price_unit"],
            whats_included=parsed_whats_included,
            duration_minutes=validated_data.get("duration_minutes", 60),
            warranty_days=validated_data.get("warranty_days", 0),
        )

        booking.custom_service = custom_service
        booking.total_price = custom_service.base_price
        booking.save(update_fields=["custom_service", "total_price"])

        return custom_service
