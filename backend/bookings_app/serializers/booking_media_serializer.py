from rest_framework import serializers
from bookings_app.models import BookingMedia


class BookingMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingMedia
        fields = ["id", "stage", "media_type", "file", "uploaded_by", "created_at"]
