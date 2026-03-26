from rest_framework import serializers
from bookings_app.models import Booking, BookingAddon
from bookings_app.serializers.booking_media_serializer import BookingMediaSerializer


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
    service_name = serializers.SerializerMethodField()
    service_price = serializers.SerializerMethodField()
    custom_service_status = serializers.SerializerMethodField()
    custom_service_id = serializers.SerializerMethodField()
    custom_service_name = serializers.SerializerMethodField()
    custom_service_description = serializers.SerializerMethodField()
    custom_service_whats_included = serializers.SerializerMethodField()
    taaskr_id = serializers.SerializerMethodField()
    taaskr_name = serializers.SerializerMethodField()
    taaskr_phone = serializers.SerializerMethodField()
    taaskr_profile_image = serializers.SerializerMethodField()
    before_media = serializers.SerializerMethodField()
    after_media = serializers.SerializerMethodField()
    addons = BookingAddonSerializer(
        source="bookingaddon_set",
        many=True,
        read_only=True
    )

    class Meta:
        model = Booking
        fields = "__all__"

    def get_service_name(self, obj):
        if obj.custom_service:
            return obj.custom_service.name
        return obj.service.name if obj.service else ""

    def get_service_price(self, obj):
        if obj.custom_service:
            return obj.custom_service.base_price
        return obj.service.base_price if obj.service else 0

    def get_custom_service_status(self, obj):
        return obj.custom_service.status if obj.custom_service else None

    def get_custom_service_id(self, obj):
        return obj.custom_service.id if obj.custom_service else None

    def get_custom_service_name(self, obj):
        return obj.custom_service.name if obj.custom_service else None

    def get_custom_service_description(self, obj):
        return obj.custom_service.description if obj.custom_service else None

    def get_custom_service_whats_included(self, obj):
        if not obj.custom_service:
            return []
        whats_included = obj.custom_service.whats_included
        if isinstance(whats_included, list):
            return whats_included
        if isinstance(whats_included, str):
            return [v.strip() for v in whats_included.splitlines() if v.strip()]
        return []

    def _get_assigned_taaskr(self, obj):
        assignment = (
            obj.assignments.select_related("taaskr")
            .filter(status="accepted")
            .order_by("-created_at")
            .first()
        )
        return assignment.taaskr if assignment else None

    def get_taaskr_id(self, obj):
        taaskr = self._get_assigned_taaskr(obj)
        return taaskr.id if taaskr else None

    def get_taaskr_name(self, obj):
        taaskr = self._get_assigned_taaskr(obj)
        return taaskr.full_name if taaskr else None

    def get_taaskr_phone(self, obj):
        taaskr = self._get_assigned_taaskr(obj)
        return taaskr.phone if taaskr else None

    def get_taaskr_profile_image(self, obj):
        taaskr = self._get_assigned_taaskr(obj)
        if not taaskr or not taaskr.profile_image:
            return None
        try:
            request = self.context.get("request")
            url = taaskr.profile_image.url
            return request.build_absolute_uri(url) if request else url
        except Exception:
            return None

    def get_before_media(self, obj):
        qs = obj.media.filter(stage="before").order_by("-created_at")
        return BookingMediaSerializer(qs, many=True, context=self.context).data

    def get_after_media(self, obj):
        qs = obj.media.filter(stage="after").order_by("-created_at")
        return BookingMediaSerializer(qs, many=True, context=self.context).data
