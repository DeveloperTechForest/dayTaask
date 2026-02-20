# bookings_app/serializers/admin/quote_request_update_serializer.py

from rest_framework import serializers
from bookings_app.models import QuoteRequest, QuoteImage


class AdminQuoteRequestUpdateSerializer(serializers.ModelSerializer):
    new_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    remove_image_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = QuoteRequest
        fields = [
            "service",
            "service_category",
            "service_name",
            "problem_description",
            "preferred_date",
            "preferred_time_slot",
            "status",
            "new_images",
            "remove_image_ids",
        ]

    def update(self, instance, validated_data):
        new_images = validated_data.pop("new_images", [])
        remove_image_ids = validated_data.pop("remove_image_ids", [])

        # Update quote fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # 🗑️ Remove selected images (also deletes files)
        if remove_image_ids:
            images = QuoteImage.objects.filter(
                id__in=remove_image_ids,
                quote_request=instance
            )
            for img in images:
                img.image.delete(save=False)
                img.delete()

        # ➕ Add new images
        for image in new_images:
            QuoteImage.objects.create(
                quote_request=instance,
                image=image,
                uploaded_by="admin",
            )

        return instance
