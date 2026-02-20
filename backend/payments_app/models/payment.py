# payments_app/models/payment.py

from django.db import models


class Payment(models.Model):

    booking = models.ForeignKey(
        "bookings_app.Booking",
        on_delete=models.CASCADE,
        related_name="payments"
    )

    amount = models.DecimalField(
        max_digits=10, decimal_places=2
    )

    # ---- METHOD / MODE ----
    payment_mode = models.CharField(
        max_length=30,
        choices=[
            ("razorpay", "Razorpay"),
            ("cod", "Cash on Delivery"),
            ("upi", "UPI"),
            ("wallet", "Wallet"),
            ("admin_adjustment", "Admin Adjustment"),
        ]
    )

    # ---- STATUS ----
    payment_status = models.CharField(
        max_length=30,
        choices=[
            ("initiated", "Initiated"),
            ("authorized", "Authorized"),
            ("captured", "Captured"),
            ("failed", "Failed"),
            ("pending", "Pending"),
            ("refunded", "Refunded"),
        ],
        default="initiated"
    )

    # ---- RAZORPAY / PROVIDER DATA ----
    provider = models.CharField(
        max_length=30,
        default="razorpay"
    )

    provider_order_id = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    provider_payment_id = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    provider_signature = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    # ---- META ----
    created_by_admin = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.booking.id} - {self.amount} - {self.payment_status}"
