# bookings_app/models/service_change_request.py

from django.db import models


class ServiceChangeRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    booking = models.ForeignKey(
        "bookings_app.Booking",
        on_delete=models.CASCADE,
        related_name="change_requests"
    )

    requested_by = models.CharField(
        max_length=20,
        choices=[("taaskr", "Taaskr"), ("admin", "Admin")]
    )

    description = models.TextField()

    proposed_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ChangeRequest #{self.id} - Booking {self.booking.id}"
