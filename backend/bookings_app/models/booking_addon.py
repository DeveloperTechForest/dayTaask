# bookings_app/models/booking_addon.py


from django.db import models


class BookingAddon(models.Model):
    booking = models.ForeignKey(
        'bookings_app.Booking', on_delete=models.CASCADE)
    addon = models.ForeignKey('services_app.Addon', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.booking.service.name} - {self.addon.name}"
