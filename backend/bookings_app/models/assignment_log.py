# bookings_app/models/assignment_log.py


from django.db import models
from bookings_app.models import Booking


class AssignmentLog(models.Model):

    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name="assignments"
    )

    taaskr = models.ForeignKey(
        'users_app.User',
        on_delete=models.CASCADE,
        related_name="assignment_logs",
        null=False,
        blank=False
    )

    assigned_by = models.ForeignKey(
        'users_app.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name="assigned_jobs"
    )

    # 🔹 Request lifecycle
    status = models.CharField(
        max_length=30,
        choices=[
            ("requested", "Requested"),
            ("accepted", "Accepted"),
            ("rejected", "Rejected"),
            ("expired", "Expired"),
            ("cancelled", "Cancelled"),
        ],
        default="requested"
    )

    # 🔹 Assignment type
    method = models.CharField(
        max_length=20,
        choices=[
            ("manual", "Manual"),
            ("broadcast", "Broadcast"),
            ("auto", "Auto"),
        ],
        default="manual"
    )

    expires_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("booking", "taaskr")
        indexes = [
            models.Index(fields=["booking", "taaskr"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"id: {self.id} - {self.booking.booking_code} → {self.taaskr}"
