# taaskr_app/views/taaskr_address_viewset.py
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from users_app.models.address import Address
from taaskr_app.serializers.taaskr_address_serializer import TaaskrAddressSerializer


class TaaskrAddressViewSet(viewsets.ModelViewSet):
    serializer_class = TaaskrAddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user).order_by("id")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"], url_path="bulk-upsert")
    def bulk_upsert(self, request):
        if not isinstance(request.data, list):
            return Response(
                {"error": "Expected a list of addresses"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        results = []
        errors = []

        for item in request.data:
            addr_id = item.get("id")
            label = item.get("label")

            address = None
            if addr_id:
                address = Address.objects.filter(
                    id=addr_id, user=request.user
                ).first()
            if address is None and label:
                address = Address.objects.filter(
                    user=request.user, label=label
                ).first()

            serializer = self.get_serializer(
                address, data=item, partial=bool(address)
            )

            if serializer.is_valid():
                serializer.save(user=request.user)
                results.append(serializer.data)
            else:
                errors.append({"data": item, "errors": serializer.errors})

        return Response({"updated": results, "errors": errors})
