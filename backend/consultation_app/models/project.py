from django.db import models


class ConsultationProject(models.Model):
    customer = models.ForeignKey(
        'users_app.User', on_delete=models.CASCADE, related_name="consultation_projects")
    taaskr = models.ForeignKey(
        'users_app.User', on_delete=models.SET_NULL, null=True, related_name="taaskr_projects")

    title = models.CharField(max_length=255)
    description = models.TextField()

    total_cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=30, default="active")

    created_at = models.DateTimeField(auto_now_add=True)
