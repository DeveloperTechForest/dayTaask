from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from services_app.models import Category
from services_app.serializers.category import CategorySerializer


class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.filter(is_active=True)
        serializer = CategorySerializer(
            categories, many=True, context={'request': request})
        return Response(serializer.data)
