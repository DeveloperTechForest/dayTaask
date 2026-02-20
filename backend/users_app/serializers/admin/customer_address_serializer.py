# users_app/serializers/admin/customer_address_serializer.py
from rest_framework import serializers
from users_app.models.address import Address


class AdminCustomerAddressSerializer(serializers.ModelSerializer):
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
            "latitude",
            "longitude",
        ]
