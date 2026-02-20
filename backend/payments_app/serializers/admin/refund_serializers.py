# payments_app/serializers/admin/refund_serializers.py

from rest_framework import serializers
from payments_app.models import Refund, Payment


class AdminRefundSerializer(serializers.ModelSerializer):
    payment_id = serializers.IntegerField(
        source="payment.id",
        read_only=True
    )

    class Meta:
        model = Refund
        fields = [
            "id",
            "payment_id",
            "amount",
            "refund_mode",
            "refund_status",
            "provider_refund_id",
            "reason",
            "created_at",
        ]


class AdminRefundCreateSerializer(serializers.ModelSerializer):
    payment_id = serializers.PrimaryKeyRelatedField(
        queryset=Payment.objects.filter(payment_status="paid"),
        source="payment"
    )

    class Meta:
        model = Refund
        fields = [
            "payment_id",
            "amount",
            "refund_mode",
            "reason",
        ]

    def validate(self, attrs):
        payment = attrs["payment"]
        amount = attrs["amount"]

        refunded_amount = sum(
            r.amount for r in payment.refunds.all()
        )

        if amount <= 0:
            raise serializers.ValidationError("Invalid refund amount")

        if refunded_amount + amount > payment.amount:
            raise serializers.ValidationError(
                "Refund exceeds paid amount"
            )

        return attrs
