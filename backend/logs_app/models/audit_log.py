from django.db import models
from django.db.models import JSONField


class AuditLog(models.Model):
    user = models.ForeignKey(
        "users_app.User", on_delete=models.SET_NULL, null=True)

    action_type = models.CharField(max_length=100)
    model_name = models.CharField(max_length=100)
    object_id = models.IntegerField()

    metadata = JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)
