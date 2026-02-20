from django.db import models


class AdminActionLog(models.Model):
    admin = models.ForeignKey("users_app.User", on_delete=models.CASCADE)

    action = models.CharField(max_length=255)
    target_type = models.CharField(max_length=100)
    target_id = models.IntegerField()

    timestamp = models.DateTimeField(auto_now_add=True)
