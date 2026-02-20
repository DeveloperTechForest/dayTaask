# users_app/serializers/customer/address_detail_serializer.py

from rest_framework import serializers
from users_app.models import Address


class CustomerAddressDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        fields = "__all__"
