# services_app/models/addon.py

from django.db import models
from .service import Service


class Addon(models.Model):
    service = models.ForeignKey(
        Service, on_delete=models.CASCADE, related_name='addons')
    name = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    description = models.CharField(max_length=250, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.service.name}"
