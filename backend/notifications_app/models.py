from django.db import models


class Notification(models.Model):
    user = models.ForeignKey("users_app.User", on_delete=models.CASCADE)

    message = models.TextField()
    type = models.CharField(max_length=50, blank=True)
    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
