from django.urls import include

from payments_app.views.customer.confirm_cod import ConfirmCODView
from payments_app.views.customer.customer_payment_viewset import CustomerPaymentViewSet
from rest_framework.routers import DefaultRouter, path
from payments_app.views.admin.payment_viewset import AdminPaymentViewSet
from payments_app.views.admin.refund_viewset import AdminRefundViewSet

router = DefaultRouter()
router.register(
    r"admin/payments",
    AdminPaymentViewSet,
    basename="admin-payments"
)
router.register(
    r"admin/refunds",
    AdminRefundViewSet,
    basename="admin-refunds"
)

# customer url

router.register(
    r"customer/payments",
    CustomerPaymentViewSet,
    basename="customer-payments"
)


urlpatterns = [
    path(
        "customer/payments/cod/",
        ConfirmCODView.as_view(),
    ),
    path("", include(router.urls)),
]
