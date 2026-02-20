from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from users_app.serializers.register_serializer import RegisterSerializer
from users_app.serializers.login_serializer import LoginSerializer
from users_app.models.role import UserRole
from users_app.utils.rbac import get_user_permissions


# ==========================
# REGISTER
# ==========================
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        response = Response({
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": getattr(user, "full_name", ""),
            }
        }, status=status.HTTP_201_CREATED)

        self._set_auth_cookies(response, refresh)
        return response

    def _set_auth_cookies(self, response, refresh):
        response.set_cookie(
            key=settings.AUTH_COOKIE,
            value=str(refresh.access_token),
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            secure=settings.AUTH_COOKIE_SECURE,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            max_age=settings.AUTH_COOKIE_MAX_AGE,
        )

        response.set_cookie(
            key=settings.AUTH_COOKIE_REFRESH,
            value=str(refresh),
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            secure=settings.AUTH_COOKIE_SECURE,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            max_age=settings.AUTH_REFRESH_COOKIE_MAX_AGE,
        )


# ==========================
# LOGIN
# ==========================
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        user = authenticate(
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )

        if not user:
            return Response({"error": "Invalid credentials"}, status=401)

        refresh = RefreshToken.for_user(user)

        roles = list(
            UserRole.objects.filter(user=user)
            .values("role__name", "role__is_admin_role")
        )

        permissions = get_user_permissions(user)

        response = Response({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "email": user.email,
                "roles": roles,
                "permissions": permissions,
            }
        })

        response.set_cookie(
            key=settings.AUTH_COOKIE,
            value=str(refresh.access_token),
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            secure=settings.AUTH_COOKIE_SECURE,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            max_age=settings.AUTH_COOKIE_MAX_AGE,
        )

        response.set_cookie(
            key=settings.AUTH_COOKIE_REFRESH,
            value=str(refresh),
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            secure=settings.AUTH_COOKIE_SECURE,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            max_age=settings.AUTH_REFRESH_COOKIE_MAX_AGE,
        )

        return response


# ==========================
# LOGOUT
# ==========================
class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logged out"}, status=200)

        response.delete_cookie(settings.AUTH_COOKIE,
                               samesite=settings.AUTH_COOKIE_SAMESITE)
        response.delete_cookie(settings.AUTH_COOKIE_REFRESH,
                               samesite=settings.AUTH_COOKIE_SAMESITE)

        return response
