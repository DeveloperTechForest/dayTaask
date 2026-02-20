# users_app/models/address.py
from django.db import models


class Address(models.Model):
    user = models.ForeignKey(
        'users_app.User', on_delete=models.CASCADE, related_name="addresses")

    label = models.CharField(max_length=50, default="Home")
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    is_primary = models.BooleanField(default=False)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self):
        return f"{self.label} - {self.user} - "
