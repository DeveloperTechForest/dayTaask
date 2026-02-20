# bookings_app/models/warranty.py

from django.db import models


class Warranty(models.Model):
    booking = models.OneToOneField(
        'bookings_app.Booking', on_delete=models.CASCADE, related_name="warranty")

    start_date = models.DateField()
    end_date = models.DateField()

    claim_status = models.CharField(max_length=50, default="active")

    claim_notes = models.TextField(blank=True)

    def __str__(self):
        return f"Warranty for {self.booking}"
