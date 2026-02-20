from rest_framework import serializers
from users_app.models import Address
from django.db import transaction


class CustomerAddressCreateUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        fields = [
            "label",
            "street",
            "city",
            "state",
            "pincode",
            "latitude",
            "longitude",
            "is_primary",
        ]

    @transaction.atomic
    def create(self, validated_data):

        request = self.context["request"]

        # If primary selected → remove previous primary
        if validated_data.get("is_primary"):
            Address.objects.filter(
                user=request.user,
                is_primary=True
            ).update(is_primary=False)

        return Address.objects.create(
            user=request.user,
            **validated_data
        )

    @transaction.atomic
    def update(self, instance, validated_data):

        request = self.context["request"]

        if validated_data.get("is_primary"):
            Address.objects.filter(
                user=request.user,
                is_primary=True
            ).exclude(id=instance.id).update(is_primary=False)

        return super().update(instance, validated_data)
