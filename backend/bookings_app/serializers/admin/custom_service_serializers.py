# bookings_app/serializers/admin/custom_service_serializers.py
from rest_framework import serializers
from bookings_app.models import CustomService, QuoteRequest, Booking
import json


class ArrayTextListField(serializers.Field):
    def to_representation(self, value):
        if value is None:
            return []
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            cleaned = value.strip()
            if not cleaned:
                return []
            try:
                parsed = json.loads(cleaned)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                pass
            return [item.strip() for item in cleaned.split(",") if item.strip()]
        return []

    def to_internal_value(self, data):
        if data in (None, ""):
            return []
        if isinstance(data, list):
            return data
        if isinstance(data, str):
            cleaned = data.strip()
            if not cleaned:
                return []
            try:
                parsed = json.loads(cleaned)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                pass
            return [item.strip() for item in cleaned.split(",") if item.strip()]
        raise serializers.ValidationError("Expected a list or string.")


class AdminCustomServiceSerializer(serializers.ModelSerializer):
    quote_code = serializers.CharField(
        source="quote_request.quote_code",
        read_only=True
    )
    customer_name = serializers.CharField(
        source="quote_request.customer.full_name",
        read_only=True
    )

    class Meta:
        model = CustomService
        fields = [
            "id",
            "name",
            "quote_request",
            "description",
            "base_price",
            "price_unit",
            "whats_included",
            "duration_minutes",
            "warranty_days",
            "status",
            "is_active",
            "quote_code",
            "customer_name",
            "created_at",
            "updated_at",
        ]

    whats_included = ArrayTextListField(required=False)


class AdminCustomServiceCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomService
        fields = [
            "quote_request",
            "name",
            "description",
            "base_price",
            "price_unit",
            "whats_included",
            "duration_minutes",
            "warranty_days",
            "status",
            "is_active",
        ]

    whats_included = ArrayTextListField(required=False)

    def create(self, validated_data):
        quote = validated_data.pop("quote_request")
        request = self.context["request"]

        status = validated_data.pop("status", "sent")
        is_active = validated_data.pop("is_active", True)

        custom_service = CustomService.objects.create(
            quote_request=quote,
            created_by=request.user,
            status=status,
            is_active=is_active,
            **validated_data
        )

        quote.status = "quoted"
        quote.save(update_fields=["status"])

        return custom_service


class AdminCustomServiceUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomService
        fields = [
            "name",
            "description",
            "base_price",
            "price_unit",
            "whats_included",
            "duration_minutes",
            "warranty_days",
            "status",
            "is_active",
        ]

    whats_included = ArrayTextListField(required=False)

    def validate(self, attrs):
        instance = self.instance

        if instance.status == "completed":
            raise serializers.ValidationError(
                "Completed custom service cannot be modified"
            )

        return attrs


class AdminAttachCustomServiceToBookingSerializer(serializers.Serializer):
    booking_id = serializers.PrimaryKeyRelatedField(
        queryset=Booking.objects.all()
    )

    def validate(self, attrs):
        custom_service = self.context["custom_service"]
        booking = attrs["booking_id"]

        if booking.custom_service:
            raise serializers.ValidationError(
                "Booking already has a custom service"
            )

        if custom_service.status not in ["accepted", "sent"]:
            raise serializers.ValidationError(
                "Custom service must be accepted before attaching"
            )

        return attrs

    def save(self):
        custom_service = self.context["custom_service"]
        booking = self.validated_data["booking_id"]

        booking.custom_service = custom_service
        booking.save(update_fields=["custom_service"])

        custom_service.status = "in_progress"
        custom_service.save(update_fields=["status"])

        return booking
