# bookings_app/models/customService.py

from django.db import models
from django.contrib.postgres.fields import ArrayField


class CustomService(models.Model):

    quote_request = models.OneToOneField(
        "bookings_app.QuoteRequest",
        on_delete=models.CASCADE,
        related_name="custom_service"
    )

    base_service = models.ForeignKey(
        "services_app.Service",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="custom_variants"
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    price_unit = models.CharField(
        max_length=50,
        choices=[("fixed", "Fixed"), ("hourly", "Hourly"),
                 ("custom", "Custom")],
        default="fixed"
    )

    whats_included = ArrayField(models.CharField(
        max_length=255), default=list, blank=True)

    duration_minutes = models.PositiveIntegerField(default=60)
    warranty_days = models.PositiveIntegerField(default=0)

 # Quote lifecycle
    status = models.CharField(
        max_length=20,
        choices=[
            ("draft", "Draft"),
            ("sent", "Sent to Customer"),
            ("accepted", "Accepted"),
            ("in_progress", "In Progress"),
            ("completed", "Completed"),
            ("cancelled", "Cancelled"),
        ],
        default="draft"
    )

    created_by = models.ForeignKey(
        "users_app.User",
        on_delete=models.SET_NULL,
        null=True
    )

    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_editable(self):
        return self.status in ["draft", "sent", "accepted", "in_progress",]

    def __str__(self):
        return self.name
