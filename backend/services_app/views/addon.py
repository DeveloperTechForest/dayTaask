from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from services_app.models import Service
from services_app.serializers.addon import AddonSerializer


class AddonListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, service_id):
        try:
            service = Service.objects.get(id=service_id, is_active=True)
        except Service.DoesNotExist:
            return Response({"error": "Service not found"}, status=404)

        addons = service.addons.filter(is_active=True)
        serializer = AddonSerializer(addons, many=True)
        return Response(serializer.data)
