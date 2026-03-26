from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from bookings_app.models import QuoteRequest
from bookings_app.serializers.customer.customer_quote_request_create_serializer import (
    CustomerQuoteRequestCreateSerializer,
)
from bookings_app.serializers.customer.customer_quote_request_list_serializer import (
    CustomerQuoteRequestListSerializer,
)
from bookings_app.serializers.customer.customer_quote_request_detail_serializer import (
    CustomerQuoteRequestDetailSerializer,
)


class CustomerQuoteRequestViewSet(ModelViewSet):
    parser_classes = [MultiPartParser, FormParser]
    http_method_names = ["get", "post"]

    queryset = (
        QuoteRequest.objects.select_related(
            "service",
            "service_category",
            "booking",
        )
        .prefetch_related("images")
        .order_by("-created_at")
    )

    def get_permissions(self):
        return [IsAuthenticated()]

    def get_queryset(self):
        return self.queryset.filter(customer=self.request.user)

    def get_serializer_class(self):
        if self.action == "create":
            return CustomerQuoteRequestCreateSerializer
        if self.action == "retrieve":
            return CustomerQuoteRequestDetailSerializer
        return CustomerQuoteRequestListSerializer

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        quote = self.get_object()

        if quote.booking:
            return Response(
                {"detail": "Cannot cancel a quote with an active booking."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quote.status in ["accepted", "rejected", "expired", "cancelled"]:
            return Response(
                {"detail": "Quote cannot be cancelled in its current state."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        quote.status = "cancelled"
        quote.save(update_fields=["status"])

        return Response(
            {"detail": "Quote request cancelled successfully."},
            status=status.HTTP_200_OK,
        )
