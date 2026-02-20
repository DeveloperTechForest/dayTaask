import random
from django.core.cache import cache


def generate_otp():
    return random.randint(100000, 999999)


def store_otp(phone, otp):
    cache.set(f"otp_{phone}", otp, timeout=300)


def get_stored_otp(phone):
    return cache.get(f"otp_{phone}")


def delete_stored_otp(phone):
    cache.delete(f"otp_{phone}")
