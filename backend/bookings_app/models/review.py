# bookings_app/models/review.py

from django.db import models


class Review(models.Model):
    booking = models.OneToOneField(
        'bookings_app.Booking', on_delete=models.CASCADE)

    rating = models.PositiveIntegerField()
    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.booking}"
