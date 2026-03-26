# users_app/views/auth_views.py
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
            path="/",
            domain=settings.AUTH_COOKIE_DOMAIN,
        )

        response.set_cookie(
            key=settings.AUTH_COOKIE_REFRESH,
            value=str(refresh),
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            secure=settings.AUTH_COOKIE_SECURE,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            max_age=settings.AUTH_REFRESH_COOKIE_MAX_AGE,
            path="/",
            domain=settings.AUTH_COOKIE_DOMAIN,
        )


# ==========================
# LOGIN
# ==========================
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        email = serializer.validated_data.get("email")
        phone = serializer.validated_data.get("phone")
        password = serializer.validated_data["password"]

        user = None
        if email:
            user = authenticate(email=email, password=password)
        elif phone:
            try:
                from users_app.models.user import User
                candidate = User.objects.filter(phone=phone).first()
                if candidate and candidate.check_password(password):
                    user = candidate
            except Exception:
                user = None

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
            path="/",
            domain=settings.AUTH_COOKIE_DOMAIN,
        )

        response.set_cookie(
            key=settings.AUTH_COOKIE_REFRESH,
            value=str(refresh),
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            secure=settings.AUTH_COOKIE_SECURE,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            max_age=settings.AUTH_REFRESH_COOKIE_MAX_AGE,
            path="/",
            domain=settings.AUTH_COOKIE_DOMAIN,
        )

        return response


# ==========================
# LOGOUT
# ==========================
class LogoutView(APIView):
    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        if user:
            try:
                from taaskr_app.models.availability import Availability
                availability = Availability.objects.filter(
                    taaskr=user
                ).order_by("-updated_at").first()
                if availability:
                    availability.is_available = False
                    availability.save(
                        update_fields=["is_available", "updated_at"])
                else:
                    Availability.objects.create(
                        taaskr=user,
                        is_available=False,
                    )
            except Exception:
                pass

        response = Response({"message": "Logged out"}, status=200)

        response.delete_cookie(
            settings.AUTH_COOKIE,
            domain=settings.AUTH_COOKIE_DOMAIN,
            path="/"
        )

        response.delete_cookie(
            settings.AUTH_COOKIE_REFRESH,
            domain=settings.AUTH_COOKIE_DOMAIN,
            path="/"
        )

        return response
