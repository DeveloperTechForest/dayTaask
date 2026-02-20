# services_app/serializers/admin/categorySerializers.py


from rest_framework import serializers
from services_app.models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        exclude = ('banner',)
