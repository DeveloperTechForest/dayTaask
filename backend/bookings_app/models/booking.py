# bookings_app/models/booking.py

from django.db import models
from django.utils.crypto import get_random_string


class Booking(models.Model):

    booking_code = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        editable=False,
        db_index=True
    )

    customer = models.ForeignKey(
        'users_app.User',
        on_delete=models.CASCADE,
        related_name="customer_bookings"
    )

    service = models.ForeignKey(
        'services_app.Service', on_delete=models.CASCADE)

    custom_service = models.ForeignKey(
        "bookings_app.CustomService",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="booking"
    )

    address = models.ForeignKey(
        'users_app.Address',
        on_delete=models.SET_NULL,
        null=True
    )

    scheduled_at = models.DateTimeField()
    required_taaskrs = models.PositiveIntegerField(default=1)

    # 🔹 Booking lifecycle
    status = models.CharField(
        max_length=30,
        choices=[
            ("pending", "Pending"),
            ("confirmed", "Confirmed"),
            ("started", "Started"),
            ("completed", "Completed"),
            ("cancelled", "Cancelled"),
        ],
        default="pending"
    )

    # 🔹 Assignment lifecycle (SEPARATE FROM STATUS)
    assignment_status = models.CharField(
        max_length=30,
        choices=[
            ("unassigned", "Unassigned"),
            ("assigned", "Assigned"),
            ("declined", "Declined"),
            ("auto_assign_pending", "Auto Assign Pending"),
            ("failed", "Failed"),
        ],
        default="unassigned"
    )

    assignment_attempts = models.PositiveIntegerField(default=0)

    priority = models.CharField(
        max_length=10,
        choices=[
            ("high", "High"),
            ("medium", "Medium"),
            ("low", "Low"),
        ],
        default="medium"
    )

    total_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0)

    paid_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )

    payment_status = models.CharField(
        max_length=30,
        choices=[
            ("pending", "Pending"),
            ("cod_pending", "COD Pending"),
            ("partial", "Partially Paid"),
            ("paid", "Paid"),
            ("refunded", "Refunded"),
        ],
        default="pending"
    )

    location_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

   # ---------------------------
    # AUTO BOOKING CODE
    # ---------------------------
    def save(self, *args, **kwargs):
        if not self.booking_code:
            self.booking_code = f"BK-{get_random_string(8).upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"id: {self.id} - {self.booking_code} - {self.service.name}"
