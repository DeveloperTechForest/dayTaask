# services_app/views/admin/category_viewset.py

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from services_app.models.category import Category
from services_app.serializers.admin.categorySerializers import CategorySerializer
from users_app.permissions import HasCustomPermission


class AdminCategoryViewSet(ModelViewSet):
    parser_classes = (MultiPartParser, FormParser)
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "id"

    def get_permissions(self):
        permission_map = {
            "list": "category.view",
            "retrieve": "category.view",
            "create": "category.create",
            "update": "category.update",
            "partial_update": "category.update",
            "destroy": "category.delete",
            "toggle_active": "category.update",
        }

        perm = permission_map.get(self.action)

        permissions = [IsAuthenticated()]

        if perm:
            permissions.append(HasCustomPermission())

        return permissions

    @action(detail=True, methods=["patch"])
    def toggle_active(self, request, id=None):
        category = self.get_object()
        category.is_active = not category.is_active
        category.save()

        return Response(
            {
                "message": "Category activated" if category.is_active else "Category deactivated",
                "is_active": category.is_active
            },
            status=status.HTTP_200_OK
        )
