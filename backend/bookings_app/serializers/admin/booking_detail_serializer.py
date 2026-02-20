# bookings_app/serializers/admin/booking_detail_serializer.py

from rest_framework import serializers
from bookings_app.models import (
    Booking,
    BookingAddon,
    Recording,
    Review,
    Warranty,
)
from users_app.models import Address, User


class BookingAddonSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingAddon
        fields = ["id", "addon_name", "price"]


class RecordingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recording
        fields = ["id", "file", "created_at"]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["rating", "comment", "created_at"]


class WarrantySerializer(serializers.ModelSerializer):
    class Meta:
        model = Warranty
        fields = ["id", "expires_at", "is_active"]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ["id", "label", "street", "city", "state", "pincode"]


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "full_name", "email", "phone"]


class BookingAdminDetailSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    service_name = serializers.CharField(source="service.name", read_only=True)
    address = AddressSerializer(read_only=True)
    addons = BookingAddonSerializer(many=True, read_only=True)
    recordings = RecordingSerializer(many=True, read_only=True)
    review = ReviewSerializer(read_only=True)
    warranty = WarrantySerializer(read_only=True)
    accepted_taaskrs = serializers.SerializerMethodField()
    assigned_taaskrs = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_code",
            "customer",
            "service",
            "service_name",
            "location_notes",
            "scheduled_at",
            "status",
            "assignment_status",
            "required_taaskrs",
            "accepted_taaskrs",
            "assigned_taaskrs",
            "total_price",
            "address",
            "priority",
            "addons",
            "recordings",
            "review",
            "warranty",
            "created_at",
        ]

    def get_accepted_taaskrs(self, obj):
        return obj.assignments.filter(status="accepted").count()

    def get_assigned_taaskrs(self, obj):
        assignments = obj.assignments.filter(status="accepted")

        return [
            {
                "taaskr_id": assignment.taaskr.id,
                "taaskr_name": assignment.taaskr.full_name,
                "taaskr_phone": assignment.taaskr.phone,
                "method": assignment.method,
                "assigned_by": (
                    assignment.assigned_by.full_name
                    if assignment.assigned_by and assignment.assigned_by.full_name
                    else None
                )


            }
            for assignment in assignments
        ]
