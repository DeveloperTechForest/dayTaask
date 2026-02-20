from rest_framework import serializers
from payments_app.models import Payment
from bookings_app.models import Booking


# -----------------------------
# LIST / DETAIL SERIALIZER
# -----------------------------
class AdminPaymentSerializer(serializers.ModelSerializer):
    booking_code = serializers.CharField(
        source="booking.booking_code",
        read_only=True
    )
    customer_name = serializers.CharField(
        source="booking.customer.full_name",
        read_only=True
    )

    class Meta:
        model = Payment
        fields = [
            "id",
            "booking",
            "booking_code",
            "customer_name",
            "amount",
            "payment_mode",
            "payment_status",
            "created_at",
        ]


# -----------------------------
# CREATE PAYMENT (ADMIN)
# -----------------------------
class AdminPaymentCreateSerializer(serializers.ModelSerializer):

    booking_id = serializers.PrimaryKeyRelatedField(
        queryset=Booking.objects.all(),
        source="booking"
    )

    class Meta:
        model = Payment
        fields = [
            "booking_id",
            "amount",
            "payment_mode",     # razorpay / cash / cod / adjustment
            "payment_status",   # pending / paid / failed
        ]

    def validate(self, attrs):
        booking = attrs["booking"]
        amount = attrs["amount"]

        if amount <= 0:
            raise serializers.ValidationError(
                "Payment amount must be greater than zero"
            )

        if booking.status == "cancelled":
            raise serializers.ValidationError(
                "Cannot accept payment for cancelled booking"
            )

        return attrs

    def create(self, validated_data):
        payment = super().create(validated_data)

        booking = payment.booking

        # ✅ Update booking payment summary
        if payment.payment_status == "paid":
            booking.paid_amount += payment.amount

        if booking.paid_amount >= booking.total_price:
            booking.payment_status = "paid"
        elif booking.paid_amount > 0:
            booking.payment_status = "partial"
        else:
            booking.payment_status = "pending"

        booking.save(
            update_fields=["paid_amount", "payment_status"]
        )

        return payment


# -----------------------------
# UPDATE PAYMENT (ADMIN)
# -----------------------------
class AdminPaymentUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = [
            "payment_status",
        ]

    def update(self, instance, validated_data):
        old_status = instance.payment_status
        instance = super().update(instance, validated_data)

        booking = instance.booking

        # Handle status transitions
        if old_status != "paid" and instance.payment_status == "paid":
            booking.paid_amount += instance.amount

        if booking.paid_amount >= booking.total_price:
            booking.payment_status = "paid"
        elif booking.paid_amount > 0:
            booking.payment_status = "partial"
        else:
            booking.payment_status = "pending"

        booking.save(
            update_fields=["paid_amount", "payment_status"]
        )

        return instance
