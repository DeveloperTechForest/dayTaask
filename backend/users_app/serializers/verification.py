# users_app/serializers/verification.py

from rest_framework import serializers
from django.core.cache import cache
from django.conf import settings
import random
import string


class SendOTPSerializer(serializers.Serializer):
    """Used for both email and phone"""
    pass  # no fields needed – user is from request.user


class VerifyOTPSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6, min_length=6)


def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))
