# taaskr_app/models/profile.py

from django.db import models
from django.contrib.postgres.fields import ArrayField


class TaaskrProfile(models.Model):
    user = models.OneToOneField('users_app.User', on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    skill_tags = ArrayField(models.CharField(max_length=100), default=list)
    certification = ArrayField(models.URLField(), default=list)

    rating_avg = models.FloatField(default=0.0)
    total_jobs = models.PositiveIntegerField(default=0)

    verified = models.BooleanField(default=False)

    def __str__(self):
        return f"id: {self.id}, TaaskrProfile({self.user}), user_id: {self.user.id}"
