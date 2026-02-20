# users_app/serializers/customer/address_list_serializer.py

from rest_framework import serializers
from users_app.models import Address


class CustomerAddressListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        fields = [
            "id",
            "label",
            "street",
            "city",
            "state",
            "pincode",
            "is_primary",
        ]
