# taaskr_app/models/availability.py
from django.db import models
from django.conf import settings


class Availability(models.Model):

    taaskr = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Better than hardcoding "users_app.User"
        on_delete=models.CASCADE,
        related_name="availabilities",  # Allows user.availabilities.all()
    )

    is_available = models.BooleanField(
        default=True,
        help_text="Uncheck to mark as unavailable (e.g., vacation)"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("taaskr", "is_available")

    def __str__(self):
        return f"{self.id} - {self.taaskr} ({self.is_available})"
