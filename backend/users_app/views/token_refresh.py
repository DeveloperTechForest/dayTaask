from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError


class RefreshAccessTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH)

        if not refresh_token:
            return Response({"error": "No refresh token"}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = refresh.access_token
        except TokenError:
            return Response({"error": "Invalid refresh token"}, status=401)

        response = Response({"message": "Token refreshed"})

        response.set_cookie(
            key=settings.AUTH_COOKIE,
            value=str(new_access),
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            secure=settings.AUTH_COOKIE_SECURE,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            max_age=settings.AUTH_COOKIE_MAX_AGE,
        )

        return response
