# users_app/models/role.py

from django.db import models


class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)
    is_admin_role = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class UserRole(models.Model):
    user = models.ForeignKey('users_app.User', on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user} - {self.role}"
