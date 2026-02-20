from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import get_user_model
from auth_app.utils.otp_utils import generate_otp, store_otp, get_stored_otp, delete_stored_otp

User = get_user_model()


class SendOTPView(APIView):
    def post(self, request):
        phone = request.data.get("phone")

        otp = generate_otp()
        store_otp(phone, otp)

        # For now just return OTP (later use SMS gateway)
        return Response({"message": "OTP sent", "otp": otp})


class VerifyOTPView(APIView):
    def post(self, request):
        phone = request.data.get("phone")
        otp = request.data.get("otp")

        saved_otp = get_stored_otp(phone)

        if not saved_otp or str(saved_otp) != str(otp):
            return Response({"error": "Invalid OTP"}, status=400)

        delete_stored_otp(phone)

        user, created = User.objects.get_or_create(phone=phone)

        return Response({
            "message": "OTP verified",
            "token": user.get_tokens()
        })
