from django.urls import path
from auth_app.views.google_auth import google_login, google_callback

urlpatterns = [
    path("login/", google_login, name="google_login"),
    path("callback/", google_callback, name="google-callback"),
]
