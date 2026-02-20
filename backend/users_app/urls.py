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
    path("customer/me/", ProfileView.as_view(), name="profile"),
    path("customer/me/avatar/", AvatarUploadView.as_view(), name="upload-avatar"),
    path("customer/me/change-password/",
         ChangePasswordView.as_view(), name="change-password"),

    path("", include(router.urls)),

]
