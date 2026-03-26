# taaskr_app/serializers/taaskr_address_serializer.py
from rest_framework import serializers
from users_app.models.address import Address


class TaaskrAddressSerializer(serializers.ModelSerializer):
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
