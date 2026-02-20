# users_app/models/permission.py

from django.db import models


class Permission(models.Model):
    code_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.code_name


class RolePermission(models.Model):
    role = models.ForeignKey('users_app.Role', on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.role.name} - {self.permission.code_name}"
