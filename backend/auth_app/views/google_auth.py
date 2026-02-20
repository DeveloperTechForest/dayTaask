import json
import requests

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

from rest_framework_simplejwt.tokens import RefreshToken

from users_app.models import User
from users_app.models.role import UserRole
from users_app.utils.rbac import get_user_permissions


# ==========================
# GOOGLE LOGIN URL
# ==========================
def google_login(request):
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        "?response_type=code"
        f"&client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={settings.GOOGLE_REDIRECT_URI}"
        "&scope=email profile openid"
    )
    return JsonResponse({"auth_url": google_auth_url})


# ==========================
# GOOGLE CALLBACK
# ==========================
@csrf_exempt
def google_callback(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        body = json.loads(request.body)
        code = body.get("code")
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if not code:
        return JsonResponse({"error": "Authorization code missing"}, status=400)

    # --------------------------------------------------
    # 1️⃣ Exchange CODE → GOOGLE TOKEN
    # --------------------------------------------------
    token_response = requests.post(
        settings.GOOGLE_TOKEN_URL,
        data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        },
        timeout=10
    )

    if token_response.status_code != 200:
        return JsonResponse({
            "error": "Google token exchange failed",
            "google_response": token_response.json()
        }, status=400)

    google_access_token = token_response.json().get("access_token")

    # --------------------------------------------------
    # 2️⃣ Fetch Google User Info
    # --------------------------------------------------
    userinfo_response = requests.get(
        settings.GOOGLE_USERINFO_URL,
        headers={"Authorization": f"Bearer {google_access_token}"},
        timeout=10
    )

    if userinfo_response.status_code != 200:
        return JsonResponse({"error": "Failed to fetch Google user info"}, status=400)

    google_user = userinfo_response.json()

    email = google_user.get("email")
    name = google_user.get("name")
    picture = google_user.get("picture")

    if not email:
        return JsonResponse({"error": "Google account has no email"}, status=400)

    # --------------------------------------------------
    # 3️⃣ Create or Get User
    # --------------------------------------------------
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            "full_name": name,
            "profile_image": picture,
            "email_verified": True,
        }
    )

    # --------------------------------------------------
    # 4️⃣ Generate JWT
    # --------------------------------------------------
    refresh = RefreshToken.for_user(user)

    roles = list(
        UserRole.objects.filter(user=user)
        .values_list("role__name", flat=True)
    )

    permissions = get_user_permissions(user)

    # --------------------------------------------------
    # 5️⃣ Response + COOKIES
    # --------------------------------------------------
    response = JsonResponse({
        "message": "Google login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.full_name,
            "image": user.profile_image,
            "new_user": created,
            "roles": roles,
            "permissions": permissions,
        }
    })

    # ✅ ACCESS TOKEN COOKIE (LONG)
    response.set_cookie(
        key=settings.AUTH_COOKIE,
        value=str(refresh.access_token),
        httponly=settings.AUTH_COOKIE_HTTP_ONLY,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        max_age=settings.AUTH_COOKIE_MAX_AGE,   # ✅ 24 hours
    )

    # ✅ REFRESH TOKEN COOKIE (LONGER)
    response.set_cookie(
        key=settings.AUTH_COOKIE_REFRESH,
        value=str(refresh),
        httponly=settings.AUTH_COOKIE_HTTP_ONLY,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        max_age=settings.AUTH_REFRESH_COOKIE_MAX_AGE,  # ✅ 7 days
    )

    return response
