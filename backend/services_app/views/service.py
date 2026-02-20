from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from services_app.models.service import Service
from services_app.models.category import Category
from services_app.models.addon import Addon
from services_app.serializers.service import ServiceSerializer

# Pagination class can also be global via settings (shown later)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10  # default page size (override in settings or view)
    page_size_query_param = 'page_size'
    max_page_size = 100

# All services with pagination (for "All Services" page)


class ServiceListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Service.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ServiceSerializer
    pagination_class = StandardResultsSetPagination

# List services by category (paginated)


class ServiceListByCategoryView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ServiceSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        category_id = self.kwargs.get('category_id')
        return Service.objects.filter(category_id=category_id, is_active=True).order_by('-created_at')

# Service detail view


class ServiceDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, service_id):
        try:
            service = Service.objects.get(id=service_id, is_active=True)
        except Service.DoesNotExist:
            return Response({"error": "Service not found"}, status=404)

        serializer = ServiceSerializer(service, context={'request': request})
        return Response(serializer.data)

# Home page limited endpoint (no pagination, limited items)


class HomePageAPI(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        top_services = Service.objects.filter(
            is_active=True).order_by('-created_at')[:6]
        categories = Category.objects.filter(
            is_active=True).order_by('name')[:8]

        from services_app.serializers.service import ServiceSerializer
        from services_app.serializers.category import CategorySerializer

        data = {
            "top_services": ServiceSerializer(top_services, many=True, context={'request': request}).data,
            "categories": CategorySerializer(categories, many=True, context={'request': request}).data
        }
        return Response(data)
