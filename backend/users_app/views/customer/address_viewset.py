from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from users_app.models import Address
from users_app.serializers.customer.address_list_serializer import (
    CustomerAddressListSerializer
)
from users_app.serializers.customer.address_detail_serializer import (
    CustomerAddressDetailSerializer
)
from users_app.serializers.customer.address_create_update_serializer import (
    CustomerAddressCreateUpdateSerializer
)


class CustomerAddressViewSet(ModelViewSet):

    permission_classes = [IsAuthenticated]

    queryset = Address.objects.all().order_by("-id")

    # ---------------------------
    # LIMIT TO OWN ADDRESSES
    # ---------------------------
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    # ---------------------------
    # SERIALIZER SWITCH
    # ---------------------------
    def get_serializer_class(self):

        if self.action == "retrieve":
            return CustomerAddressDetailSerializer

        if self.action in ["create", "update", "partial_update"]:
            return CustomerAddressCreateUpdateSerializer

        return CustomerAddressListSerializer
