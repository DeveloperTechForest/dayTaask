# bookings_app/models/booking_media.py

from django.db import models


class BookingMedia(models.Model):
    booking = models.ForeignKey(
        "bookings_app.Booking",
        on_delete=models.CASCADE,
        related_name="media",
    )
    stage = models.CharField(
        max_length=10,
        choices=[("before", "Before"), ("after", "After")],
    )
    media_type = models.CharField(
        max_length=10,
        choices=[("photo", "Photo"), ("audio", "Audio")],
    )
    file = models.FileField(upload_to="bookings/media/%Y/%m/%d/")
    uploaded_by = models.CharField(
        max_length=10,
        choices=[("taaskr", "Taaskr"), ("customer", "Customer")],
        default="taaskr",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"BookingMedia {self.id} - {self.stage} - {self.media_type}"
