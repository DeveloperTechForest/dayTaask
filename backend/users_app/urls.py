from users_app.views.customer.profile_views import (
    ProfileView,
    AvatarUploadView,
    ChangePasswordView,
)
from django.urls import path, include

from users_app.views.customer.address_viewset import CustomerAddressViewSet
from .views.auth_views import RegisterView, LoginView, LogoutView
from .views.token_refresh import RefreshAccessTokenView
from .views.UserDetailView import UserDetailView
from rest_framework.routers import DefaultRouter
from users_app.views.role import RoleViewSet
from users_app.views.permission import PermissionViewSet
from users_app.views.assignments import AssignPermissionToRole
from users_app.views.admin.customer_viewset import AdminCustomerViewSet
from users_app.views.admin.customer_address_viewset import AdminCustomerAddressViewSet
from users_app.views.verification_views import (
    SendEmailOTPView, VerifyEmailOTPView,
    SendPhoneOTPView, VerifyPhoneOTPView,
)

router = DefaultRouter()
router.register(r"roles", RoleViewSet, basename="role")
router.register(r"permissions", PermissionViewSet, basename="permissions")
router.register(r"customers", AdminCustomerViewSet, basename="admin-customers")
router.register(
    r"customer/addresses",
    CustomerAddressViewSet,
    basename="customer-addresses"
)


urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("token/refresh/", RefreshAccessTokenView.as_view()),
    path("me/", UserDetailView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("roles/assign-permission/", AssignPermissionToRole.as_view()),
    path(
        "customers/<int:customer_id>/addresses/",
        AdminCustomerAddressViewSet.as_view({
            "get": "list",
            "post": "create",
        })),
    path(
        "customers/<int:customer_id>/addresses/<int:pk>/",
        AdminCustomerAddressViewSet.as_view({
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
    ),

    # customer profile apis
    path("customer/me/", ProfileView.as_view(), name="customer-profile"),
    path("customer/me/avatar/", AvatarUploadView.as_view(),
         name="customer-avatar-upload"),
    path("customer/me/change-password/",
         ChangePasswordView.as_view(), name="customer-change-password"),


    # otp urls
    path("customer/send-email-otp/",
         SendEmailOTPView.as_view(), name="send-email-otp"),
    path("customer/verify-email-otp/",
         VerifyEmailOTPView.as_view(), name="verify-email-otp"),
    path("customer/send-phone-otp/",
         SendPhoneOTPView.as_view(), name="send-phone-otp"),
    path("customer/verify-phone-otp/",
         VerifyPhoneOTPView.as_view(), name="verify-phone-otp"),

    path("", include(router.urls)),

]
