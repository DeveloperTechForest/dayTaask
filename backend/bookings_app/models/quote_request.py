# quotes_app/models/quote_request.py

from django.db import models
from django.utils.crypto import get_random_string


class QuoteRequest(models.Model):

    quote_code = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        db_index=True
    )

    customer = models.ForeignKey(
        "users_app.User",
        on_delete=models.CASCADE,
        related_name="quote_requests"
    )

    # Optional base service reference (helps admin)
    service = models.ForeignKey(
        "services_app.Service",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    service_category = models.ForeignKey(
        "services_app.Category",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    service_name = models.CharField(
        max_length=200
    )

    problem_description = models.TextField()

    # Customer preferred schedule (NOT binding)
    preferred_date = models.DateField(null=True, blank=True)
    preferred_time_slot = models.CharField(
        max_length=50,
        blank=True
    )

    # Quote lifecycle
    status = models.CharField(
        max_length=20,
        choices=[
            ("open", "Open"),
            ("under_review", "Under Review"),
            ("quoted", "Quoted"),
            ("accepted", "Accepted"),
            ("rejected", "Rejected"),
            ("expired", "Expired"),
        ],
        default="open"
    )

    # Optional linkage once booking is created
    booking = models.OneToOneField(
        "bookings_app.Booking",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ---------------------------
    # AUTO QUOTE CODE
    # ---------------------------
    def save(self, *args, **kwargs):
        if not self.quote_code:
            self.quote_code = f"QR-{get_random_string(8).upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quote_code} - {self.customer}"
