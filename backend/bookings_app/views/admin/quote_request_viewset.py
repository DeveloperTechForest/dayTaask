from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from bookings_app.models import QuoteRequest, CustomService, QuoteImage

from bookings_app.serializers.admin.quote_image_serializer import (
    QuoteImageSerializer
)
from bookings_app.serializers.admin.quote_request_list_serializer import (
    AdminQuoteRequestListSerializer,
)
from bookings_app.serializers.admin.quote_request_detail_serializer import (
    AdminQuoteRequestDetailSerializer,
)
from bookings_app.serializers.admin.quote_request_update_serializer import (
    AdminQuoteRequestUpdateSerializer,
)
from bookings_app.serializers.admin.quote_request_create_serializer import (
    AdminQuoteRequestCreateSerializer
)

from users_app.permissions import HasCustomPermission


class AdminQuoteRequestViewSet(ModelViewSet):
    parser_classes = [MultiPartParser, FormParser]
    http_method_names = ["get", "post", "patch", "delete"]

    queryset = (
        QuoteRequest.objects
        .select_related(
            "customer",
            "service",
            "service_category",
            "booking",
        )
        .order_by("-created_at")
    )

    # ---------------------------
    # SERIALIZERS
    # ---------------------------
    def get_serializer_class(self):
        if self.action == "create":
            return AdminQuoteRequestCreateSerializer
        if self.action == "retrieve":
            return AdminQuoteRequestDetailSerializer
        if self.action == "partial_update":
            return AdminQuoteRequestUpdateSerializer
        return AdminQuoteRequestListSerializer

    # ---------------------------
    # PERMISSIONS
    # ---------------------------
    def get_permissions(self):
        permission_map = {
            "list": "quote.view",
            "retrieve": "quote.view",
            "create": "quote.create",
            "partial_update": "quote.update",
            "upload_image": "quote.update",
            "create_custom_service": "quote.update",
            "destroy": "quote.delete",
        }

        HasCustomPermission.required_permissions = permission_map.get(
            self.action)
        return [IsAuthenticated(), HasCustomPermission()]

    # ---------------------------
    # UPLOAD QUOTE IMAGE
    # ---------------------------

    @action(
        detail=True,
        methods=["post"],
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_image(self, request, pk=None):
        quote = self.get_object()

        image = request.FILES.get("image")
        if not image:
            return Response(
                {"detail": "Image file is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        quote_image = QuoteImage.objects.create(
            quote_request=quote,
            image=image,
            uploaded_by="admin",
        )

        serializer = QuoteImageSerializer(
            quote_image,
            context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # ---------------------------
    # DELETE QUOTE REQUEST
    # ---------------------------

    def destroy(self, request, *args, **kwargs):
        quote = self.get_object()

        # ❌ Prevent delete if booking exists
        if quote.booking:
            return Response(
                {"detail": "Cannot delete quote with active booking"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ❌ Prevent delete if accepted
        if quote.status == "accepted":
            return Response(
                {"detail": "Cannot delete accepted quote"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 🧹 DELETE IMAGE FILES + ROWS
        images = QuoteImage.objects.filter(quote_request=quote)
        for img in images:
            if img.image:
                img.image.delete(save=False)  # 🔥 deletes file from storage
            img.delete()

        quote.delete()

        return Response(
            {"detail": "Quote request and images deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )
