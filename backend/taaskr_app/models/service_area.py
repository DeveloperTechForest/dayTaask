# taaskr_app/models/service_area.py
from django.conf import settings
from django.db import models


class ServiceArea(models.Model):
    name = models.CharField(max_length=150)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    radius_km = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["city", "name"]
        db_table = "taaskr_app_servicearea"

    def __str__(self):
        return f"{self.name} - {self.city}, {self.state} ({self.radius_km}km)"


class TaaskrServiceArea(models.Model):
    taaskr = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="taaskr_service_areas",
    )
    service_area = models.ForeignKey(
        ServiceArea,
        on_delete=models.CASCADE,
        related_name="taaskr_links",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "taaskr_app_taaskrservicearea"
        unique_together = ("taaskr", "service_area")

    def __str__(self):
        return f"{self.taaskr_id} -> {self.service_area_id}"
