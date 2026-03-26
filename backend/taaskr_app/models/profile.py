# taaskr_app/models/profile.py

from django.db import models
from django.contrib.postgres.fields import ArrayField


class TaaskrProfile(models.Model):
    user = models.OneToOneField("users_app.User", on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    skill_tags = ArrayField(
        models.CharField(max_length=100),
        blank=True,
        null=True,
        default=list,
    )
    certification = models.CharField(max_length=100, blank=True, null=True)

    rating_avg = models.FloatField(default=0.0)
    total_jobs = models.IntegerField(default=0)
    verified = models.BooleanField(default=False)

    dob = models.DateField(null=True, blank=True)

    bank_account_holder_name = models.CharField(max_length=150, blank=True, null=True)
    bank_account_number = models.CharField(max_length=64, blank=True, null=True)
    bank_ifsc_code = models.CharField(max_length=32, blank=True, null=True)
    bank_name = models.CharField(max_length=150, blank=True, null=True)
    bank_upi_id = models.CharField(max_length=150, blank=True, null=True)

    government_id_image = models.ImageField(
        upload_to="taaskr/docs/", null=True, blank=True
    )
    address_proof_image = models.ImageField(
        upload_to="taaskr/docs/", null=True, blank=True
    )
    profile_photo_image = models.ImageField(
        upload_to="taaskr/docs/", null=True, blank=True
    )

    onboarding_completed = models.BooleanField(default=False)
    verification_status = models.CharField(max_length=20, default="pending")
    verification_note = models.TextField(blank=True, null=True)
    documents_verified = models.BooleanField(default=False)
    bank_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"id: {self.id}, TaaskrProfile({self.user}), user_id: {self.user.id}"
