from rest_framework import serializers
from bookings_app.models import AssignmentLog


class TaaskrPendingAssignmentSerializer(serializers.ModelSerializer):
    """
    Used for pending requests list
    Shows enough info for taaskr to decide accept/reject
    """
    booking_id = serializers.IntegerField(source="booking.id", read_only=True)
    booking_code = serializers.CharField(source="booking.booking_code", read_only=True)
    service_name = serializers.CharField(source="booking.service.name", read_only=True)
    service_image = serializers.ImageField(source="booking.service.image", read_only=True)
    customer_name = serializers.CharField(source="booking.customer.full_name", read_only=True)
    scheduled_at = serializers.DateTimeField(source="booking.scheduled_at", read_only=True)
    required_taaskrs = serializers.IntegerField(source="booking.required_taaskrs", read_only=True)
    accepted_count = serializers.SerializerMethodField()
    location_short = serializers.SerializerMethodField()
    total_price = serializers.DecimalField(
        source="booking.total_price", max_digits=10, decimal_places=2, read_only=True
    )
    booking_status = serializers.CharField(source="booking.status", read_only=True)
    expires_in = serializers.SerializerMethodField()

    class Meta:
        model = AssignmentLog
        fields = [
            "id",
            "booking_id",
            "booking_code",
            "service_name",
            "service_image",
            "customer_name",
            "scheduled_at",
            "required_taaskrs",
            "accepted_count",
            "location_short",
            "total_price",
            "booking_status",
            "expires_at",
            "expires_in",
            "created_at",
            "method",
        ]
        read_only_fields = fields

    def get_accepted_count(self, obj):
        return obj.booking.assignments.filter(status="accepted").count()

    def get_location_short(self, obj):
        addr = obj.booking.address
        if not addr:
            return "-"
        parts = [addr.city, addr.state]
        return ", ".join([p for p in parts if p]) or "-"

    def get_expires_in(self, obj):
        from django.utils import timezone

        if not obj.expires_at:
            return "-"
        delta = obj.expires_at - timezone.now()
        if delta.total_seconds() <= 0:
            return "Expired"
        hours = int(delta.total_seconds() // 3600)
        if hours > 0:
            return f"{hours}h left"
        minutes = int(delta.total_seconds() // 60)
        return f"{minutes} min left"


class TaaskrAssignmentHistorySerializer(serializers.ModelSerializer):
    """
    Used for full history view
    Slightly more compact + includes final status
    """
    booking_id = serializers.IntegerField(source="booking.id", read_only=True)
    booking_code = serializers.CharField(source="booking.booking_code", read_only=True)
    service_name = serializers.CharField(source="booking.service.name", read_only=True)
    customer_name = serializers.CharField(source="booking.customer.full_name", read_only=True)
    scheduled_at = serializers.DateTimeField(source="booking.scheduled_at", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    location_short = serializers.SerializerMethodField()
    total_price = serializers.DecimalField(
        source="booking.total_price", max_digits=10, decimal_places=2, read_only=True
    )
    booking_status = serializers.CharField(source="booking.status", read_only=True)

    class Meta:
        model = AssignmentLog
        fields = [
            "id",
            "booking_id",
            "booking_code",
            "service_name",
            "customer_name",
            "scheduled_at",
            "location_short",
            "total_price",
            "booking_status",
            "status",
            "status_display",
            "method",
            "expires_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_location_short(self, obj):
        addr = obj.booking.address
        if not addr:
            return "-"
        parts = [addr.city, addr.state]
        return ", ".join([p for p in parts if p]) or "-"
