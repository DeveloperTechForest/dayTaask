from django.urls import path, include
from services_app.views.category import CategoryListView
from services_app.views.service import (
    ServiceListView, ServiceListByCategoryView, ServiceDetailView, HomePageAPI
)
from services_app.views.addon import AddonListView
from rest_framework.routers import DefaultRouter
from services_app.views.admin.category_viewset import AdminCategoryViewSet
from services_app.views.admin.services_viewset import AdminServiceViewSet
from services_app.views.admin.addon_viewset import AdminAddonViewSet


router = DefaultRouter()
router.register(r"admin/categories", AdminCategoryViewSet, basename="category")
router.register(r"admin/services", AdminServiceViewSet, basename="service")
router.register(r"admin/addons", AdminAddonViewSet, basename="addon")

urlpatterns = [
    path('home/', HomePageAPI.as_view(), name='services-home'),
    path('categories/', CategoryListView.as_view(), name='service-categories'),

    # All services (paginated)
    path('all-services/', ServiceListView.as_view(), name='service-list'),

    # Services by category (paginated)
    path('category/<int:category_id>/services/',
         ServiceListByCategoryView.as_view(), name='services-by-category'),

    # Service detail
    path('services-detail/<int:service_id>/',
         ServiceDetailView.as_view(), name='service-detail'),

    # Addons for a service
    path('<int:service_id>/addons/',
         AddonListView.as_view(), name='service-addons'),

    path("", include(router.urls)),
]
