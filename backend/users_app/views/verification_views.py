# users_app/views/verification_views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from django.conf import settings
from django.core.mail import send_mail
from users_app.serializers.verification import generate_otp
from users_app.serializers.verification import SendOTPSerializer, VerifyOTPSerializer
import random


class SendEmailOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            print("User:", user.email)  # ← debug print

            if user.email_verified:
                return Response({"detail": "Email already verified"}, status=status.HTTP_400_BAD_REQUEST)

            cache_key = f"otp:email:{user.id}"
            attempt_key = f"otp:email:attempts:{user.id}"

            # Rate limiting
            attempts = cache.get(attempt_key, 0)
            if attempts >= settings.OTP_MAX_ATTEMPTS:
                return Response({"detail": "Too many attempts. Try again later."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

            # Generate & store OTP
            otp = generate_otp()
            cache.set(cache_key, otp, timeout=settings.OTP_EXPIRY_SECONDS)
            # 1 hour for attempts
            cache.set(attempt_key, attempts + 1, timeout=3600)

            # Send email (customize subject/body)
            subject = "Your DayTaask Email Verification Code"
            message = f"Your verification code is: {otp}\nValid for 5 minutes."
            send_mail(subject, message,
                      settings.DEFAULT_FROM_EMAIL, [user.email])

            return Response({"detail": "OTP sent to your email"}, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            traceback.print_exc()  # prints full stack trace to terminal
            return Response({"error": str(e)}, status=500)


class VerifyEmailOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        cache_key = f"otp:email:{user.id}"

        stored_otp = cache.get(cache_key)
        if not stored_otp:
            return Response({"detail": "OTP expired or not found"}, status=status.HTTP_400_BAD_REQUEST)

        if stored_otp != serializer.validated_data["otp"]:
            return Response({"detail": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        # Success
        user.email_verified = True
        user.save()

        cache.delete(cache_key)  # clean up

        return Response({"detail": "Email verified successfully"}, status=status.HTTP_200_OK)


# ──────────────────────────────────────────────
# Phone OTP – almost identical, but uses SMS service
# ──────────────────────────────────────────────

class SendPhoneOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.phone_verified:
            return Response({"detail": "Phone already verified"}, status=status.HTTP_400_BAD_REQUEST)

        if not user.phone:
            return Response({"detail": "No phone number found"}, status=status.HTTP_400_BAD_REQUEST)

        cache_key = f"otp:phone:{user.id}"
        attempt_key = f"otp:phone:attempts:{user.id}"

        attempts = cache.get(attempt_key, 0)
        if attempts >= settings.OTP_MAX_ATTEMPTS:
            return Response({"detail": "Too many attempts. Try again later."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        otp = generate_otp()
        cache.set(cache_key, otp, timeout=settings.OTP_EXPIRY_SECONDS)
        cache.set(attempt_key, attempts + 1, timeout=3600)

        # Send SMS (replace with real SMS service: Twilio, MSG91, etc.)
        # Example placeholder:
        message = f"Your DayTaask verification code is: {otp}. Valid for 5 minutes."
        # send_sms(user.phone, message)  # your SMS function

        return Response({"detail": "OTP sent to your phone"}, status=status.HTTP_200_OK)


class VerifyPhoneOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        cache_key = f"otp:phone:{user.id}"

        stored_otp = cache.get(cache_key)
        if not stored_otp:
            return Response({"detail": "OTP expired or not found"}, status=status.HTTP_400_BAD_REQUEST)

        if stored_otp != serializer.validated_data["otp"]:
            return Response({"detail": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        user.phone_verified = True
        user.save()

        cache.delete(cache_key)

        return Response({"detail": "Phone verified successfully"}, status=status.HTTP_200_OK)
