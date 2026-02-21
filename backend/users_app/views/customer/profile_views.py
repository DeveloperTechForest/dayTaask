from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from users_app.models.user import User
from users_app.serializers.customer.profile_serializer import (
    ProfileReadSerializer,
    ProfileUpdateSerializer,
    AvatarUploadSerializer,
)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileReadSerializer(
            request.user,
            # ← this line is usually missing
            context={'request': request}
        )
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        serializer = ProfileUpdateSerializer(
            user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            # Return updated profile
            return Response(ProfileReadSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AvatarUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        user = request.user
        serializer = AvatarUploadSerializer(
            user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()  # django-cleanup deletes old file automatically
            return Response({
                "message": "Profile picture updated successfully",
                "profile_image": user.profile_image.url if user.profile_image else None
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.post(request)  # Handle PATCH same as POST for simplicity


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response(
                {"detail": "Both old_password and new_password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(old_password):
            return Response(
                {"old_password": "Current password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password changed successfully"})
