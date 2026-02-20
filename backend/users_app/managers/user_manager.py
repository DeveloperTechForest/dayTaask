# users_app/managers/user_manager.py

from django.contrib.auth.models import BaseUserManager


class UserManager(BaseUserManager):

    def create_user(self, email=None, phone=None, password=None, **extra_fields):
        if not email and not phone:
            raise ValueError(
                "User must have either an email or a phone number")

        if email:
            email = self.normalize_email(email)

        # 🚫 Ensure no invalid fields sneak in
        extra_fields.pop("role", None)

        user = self.model(
            email=email,
            phone=phone,
            **extra_fields
        )

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        # 🚫 REMOVE role (VERY IMPORTANT)
        extra_fields.pop("role", None)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")

        return self.create_user(
            email=email,
            password=password,
            **extra_fields
        )
