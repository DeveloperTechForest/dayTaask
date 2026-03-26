# taaskr_app/views/taaskr_profile.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from taaskr_app.models.profile import TaaskrProfile
from taaskr_app.serializers.taaskr_serializer import TaaskrReadSerializer
from taaskr_app.serializers.update_taaskr_serializer import UpdateTaaskrSerializer


class TaaskrProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        profile = TaaskrProfile.objects.filter(user=request.user).first()
        if not profile:
            return Response({"detail": "Taaskr profile not found"}, status=404)
        return Response(TaaskrReadSerializer(profile, context={"request": request}).data)

    def patch(self, request):
        profile = TaaskrProfile.objects.filter(user=request.user).first()
        if not profile:
            return Response({"detail": "Taaskr profile not found"}, status=404)

        serializer = UpdateTaaskrSerializer(
            instance=request.user,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        profile.refresh_from_db()
        return Response(TaaskrReadSerializer(profile, context={"request": request}).data)
