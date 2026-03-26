# users_app/views/taaskr_register_view.py
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from taaskr_app.serializers.register_taaskr_serializer import RegisterTaaskrSerializer
from taaskr_app.serializers.taaskr_serializer import TaaskrReadSerializer
from taaskr_app.models.profile import TaaskrProfile


class TaaskrRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterTaaskrSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        profile = TaaskrProfile.objects.filter(user=user).first()
        if not profile:
            return Response({"detail": "Taaskr profile not created"}, status=500)

        return Response(TaaskrReadSerializer(profile, context={"request": request}).data, status=status.HTTP_201_CREATED)
