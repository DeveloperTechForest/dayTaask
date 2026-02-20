from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=120)
    icon = models.ImageField(
        upload_to='category/icons/', blank=True, null=True)
    banner = models.ImageField(
        upload_to='category/banners/', blank=True, null=True)
    description = models.CharField(max_length=250, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
