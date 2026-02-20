from django.db import models
from .category import Category
from django.contrib.postgres.fields import ArrayField


class Service(models.Model):
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=200)
    short_description = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    base_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0)
    price_unit = models.CharField(
        max_length=50, default="fixed")  # fixed/hourly/custom
    duration_minutes = models.PositiveIntegerField(default=60)
    image = models.ImageField(
        upload_to='services/images/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    warranty_days = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    whats_included = ArrayField(models.CharField(
        max_length=255), default=list, blank=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
