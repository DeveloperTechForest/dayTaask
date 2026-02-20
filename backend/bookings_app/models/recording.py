# bookings_app/models/recording.py

from django.db import models


class Recording(models.Model):
    booking = models.ForeignKey(
        'bookings_app.Booking', on_delete=models.CASCADE)
    file_url = models.URLField()
    type = models.CharField(max_length=50, choices=[
                            ('audio', 'Audio'), ('photo', 'Photo')])

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recording for Booking {self.booking.id} - {self.type}"
