from rest_framework import serializers
from bookings_app.models import Booking
from bookings_app.models.quote_request import QuoteRequest
from bookings_app.serializers.booking_media_serializer import BookingMediaSerializer


class TaaskrBookingDetailSerializer(serializers.ModelSerializer):
    assignment_log_id = serializers.SerializerMethodField()
    booking_id = serializers.IntegerField(source="id", read_only=True)
    booking_code = serializers.CharField(read_only=True)
    customer_name = serializers.CharField(source="customer.full_name", read_only=True)
    customer_phone = serializers.CharField(source="customer.phone", read_only=True)
    service_name = serializers.CharField(source="service.name", read_only=True)
    service_description = serializers.CharField(source="service.description", read_only=True)
    service_duration_minutes = serializers.IntegerField(
        source="service.duration_minutes", read_only=True
    )
    service_whats_included = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    location_notes = serializers.CharField(read_only=True)
    scheduled_at = serializers.DateTimeField(read_only=True)
    booking_status = serializers.CharField(source="status", read_only=True)
    started_at = serializers.DateTimeField(read_only=True)
    completion_requested_at = serializers.DateTimeField(read_only=True)
    completed_at = serializers.DateTimeField(read_only=True)
    assignment_status = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()
    custom_service_id = serializers.SerializerMethodField()
    custom_service_name = serializers.SerializerMethodField()
    custom_service_status = serializers.SerializerMethodField()
    before_media = serializers.SerializerMethodField()
    after_media = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "assignment_log_id",
            "booking_id",
            "booking_code",
            "customer_name",
            "customer_phone",
            "service_name",
            "service_description",
            "service_duration_minutes",
            "service_whats_included",
            "address",
            "location_notes",
            "scheduled_at",
            "booking_status",
            "started_at",
            "completion_requested_at",
            "completed_at",
            "assignment_status",
            "attachments",
            "custom_service_id",
            "custom_service_name",
            "custom_service_status",
            "before_media",
            "after_media",
        ]

    def get_assignment_log_id(self, obj):
        log = self.context.get("assignment_log")
        return getattr(log, "id", None)

    def get_assignment_status(self, obj):
        log = self.context.get("assignment_log")
        return getattr(log, "status", None)

    def get_service_whats_included(self, obj):
        whats_included = obj.service.whats_included if obj.service else ""
        if not whats_included:
            return []
        if isinstance(whats_included, list):
            return [str(line).strip() for line in whats_included if str(line).strip()]
        if isinstance(whats_included, str):
            return [
                line.strip()
                for line in whats_included.splitlines()
                if line.strip()
            ]
        return [str(whats_included).strip()]

    def get_address(self, obj):
        addr = obj.address
        if not addr:
            return None
        parts = [addr.street, addr.city, addr.state, addr.pincode]
        return {
            "street": addr.street,
            "city": addr.city,
            "state": addr.state,
            "pincode": addr.pincode,
            "full": ", ".join([p for p in parts if p]),
            "latitude": addr.latitude,
            "longitude": addr.longitude,
        }

    def get_attachments(self, obj):
        try:
            quote = (
                QuoteRequest.objects.filter(booking=obj)
                .prefetch_related("images")
                .first()
            )
        except Exception:
            return []
        if not quote:
            return []
        return [
            {
                "url": img.image.url if img.image else "",
                "label": "Customer attachment",
            }
            for img in quote.images.all()
        ]

    def get_custom_service_id(self, obj):
        return obj.custom_service.id if obj.custom_service else None

    def get_custom_service_name(self, obj):
        return obj.custom_service.name if obj.custom_service else None

    def get_custom_service_status(self, obj):
        return obj.custom_service.status if obj.custom_service else None

    def get_before_media(self, obj):
        qs = obj.media.filter(stage="before").order_by("-created_at")
        return BookingMediaSerializer(qs, many=True, context=self.context).data

    def get_after_media(self, obj):
        qs = obj.media.filter(stage="after").order_by("-created_at")
        return BookingMediaSerializer(qs, many=True, context=self.context).data
