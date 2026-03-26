from rest_framework import serializers
from bookings_app.models import QuoteRequest, QuoteImage


class CustomerQuoteRequestCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = QuoteRequest
        fields = [
            "id",
            "quote_code",
            "service",
            "service_category",
            "service_name",
            "problem_description",
            "preferred_date",
            "preferred_time_slot",
            "images",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "quote_code", "status", "created_at"]

    def validate(self, attrs):
        service = attrs.get("service")
        service_name = attrs.get("service_name")
        if not service and not service_name:
            raise serializers.ValidationError(
                {"service_name": "Service name is required."}
            )
        return attrs

    def create(self, validated_data):
        images = validated_data.pop("images", [])
        request = self.context["request"]

        service = validated_data.get("service")
        if service and not validated_data.get("service_category"):
            validated_data["service_category"] = service.category
        if service and not validated_data.get("service_name"):
            validated_data["service_name"] = service.name

        quote = QuoteRequest.objects.create(
            customer=request.user,
            status="open",
            **validated_data,
        )

        for image in images:
            QuoteImage.objects.create(
                quote_request=quote,
                image=image,
                uploaded_by="customer",
            )

        return quote
