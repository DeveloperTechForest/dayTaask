from django.db import models

# Create your models here.


class Complaint(models.Model):
    booking = models.ForeignKey(
        "bookings_app.Booking", on_delete=models.CASCADE)
    customer = models.ForeignKey("users_app.User", on_delete=models.CASCADE)

    description = models.TextField()
    status = models.CharField(max_length=30, default="open")

    created_at = models.DateTimeField(auto_now_add=True)
