# payments_app/models/refund.py
from django.db import models


class Refund(models.Model):
    payment = models.ForeignKey(
        "payments_app.Payment",
        on_delete=models.CASCADE,
        related_name="refunds"
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    reason = models.TextField(blank=True)

    refund_mode = models.CharField(
        max_length=30,
        choices=[
            ("razorpay", "Razorpay"),
            ("cash", "Cash"),
            ("adjustment", "Adjustment"),
        ],
        default="razorpay"
    )

    refund_status = models.CharField(
        max_length=30,
        choices=[
            ("initiated", "Initiated"),
            ("processed", "Processed"),
            ("failed", "Failed"),
        ],
        default="initiated"
    )

    provider_refund_id = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Refund {self.id} for Payment {self.payment.id}"
