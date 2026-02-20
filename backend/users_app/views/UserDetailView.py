# users_app/views/user_detail.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

from users_app.serializers.user_serializer import UserMeSerializer

User = get_user_model()


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserMeSerializer(
            user,
            context={"request": request, "view": self}
        )
        return Response(serializer.data)
