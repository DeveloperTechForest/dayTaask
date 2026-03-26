# taaskr_app/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from taaskr_app.views.taaskrAvailability import AvailabilityViewSet
from taaskr_app.views.taaskr_dashboard import TaaskrDashboardView
from taaskr_app.views.taaskr import TaaskrViewSet
from taaskr_app.views.taaskr_profile import TaaskrProfileView
from taaskr_app.views.taaskr_address_viewset import TaaskrAddressViewSet
from taaskr_app.views.taaskr_service_area import ServiceAreaViewSet
from taaskr_app.views.taaskr_documents import TaaskrDocumentsView
from taaskr_app.views.admin.adminTaaskrAvailability import AdminAvailabilityViewSet
from taaskr_app.views.admin.taaskr_admin_list_viewset import TaaskrAdminListViewSet

router = DefaultRouter()
router.register(r"admin/taaskrcrud", TaaskrViewSet, basename="taaskr")
router.register(r'availability', AvailabilityViewSet,
                basename='availability')
router.register(r'admin/availability', AdminAvailabilityViewSet,
                basename='admin_availability')
router.register(r"admin/taaskrs", TaaskrAdminListViewSet,
                basename="admin-taaskrs")
router.register(r"addresses", TaaskrAddressViewSet, basename="taaskr-addresses")
router.register(r"service-areas", ServiceAreaViewSet, basename="service-areas")


urlpatterns = [
    path("dashboard/", TaaskrDashboardView.as_view(), name="taaskr-dashboard"),
    path("profile/", TaaskrProfileView.as_view(), name="taaskr-profile"),
    path("documents/", TaaskrDocumentsView.as_view(), name="taaskr-documents"),
    path("", include(router.urls)),
]


# Method,       URL,                                   Purpose

# POST,         /api/taaskr/admin/taaskrcrud/,              Public Taaskr registration
# GET,          /api/taaskr/admin/taaskrcrud/,              List all Taaskrs (admin only)
# GET,          /api/taaskr/admin/taaskrcrud/{id}/,         View single Taaskr
# PUT/PATCH,    /api/taaskr/admin/taaskrcrud/{id}/,         Update Taaskr
# DELETE,       /api/taaskr/admin/taaskrcrud/{id}/,         Delete Taaskr
# GET,          /api/taaskr/admin/taaskrcrud/me/,           Get current user's profile
