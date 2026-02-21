# users_app/models/user.py


from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone

from users_app.managers.user_manager import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    # Basic user identity
    email = models.EmailField(unique=True, null=True, blank=True)
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)

    # Verification fields
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)

    # Profile
    full_name = models.CharField(max_length=255, null=True, blank=True)
    profile_image = models.ImageField(
        upload_to='profile_images/%Y/%m/%d/',    # or 'profile_images/'
        null=True,
        blank=True,
        default=None,           # better than empty string for images
    )

    # Admin flags
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)   # Django admin panel access
    is_superuser = models.BooleanField(default=False)

    # Time tracking
    date_joined = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_available = models.BooleanField(default=True)

    # Custom manager
    objects = UserManager()

    # Login identifier → we allow login via email OR phone
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.id} - {self.full_name} - {self.email} - {self.phone}"
