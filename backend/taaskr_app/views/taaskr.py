# taaskr_app/views.py

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from taaskr_app.models.profile import TaaskrProfile
from taaskr_app.serializers.register_taaskr_serializer import RegisterTaaskrSerializer
from taaskr_app.serializers.taaskr_serializer import TaaskrReadSerializer
from taaskr_app.serializers.update_taaskr_serializer import UpdateTaaskrSerializer
from users_app.permissions import HasCustomPermission


class TaaskrViewSet(ModelViewSet):
    """
    API endpoint for managing Taaskrs (service providers)

    - create: Public (registration)
    - list/retrieve: Admin only
    - update/partial_update: Admin only
    - destroy: Admin only
    - me: Logged-in taaskr gets own profile
    """

    queryset = TaaskrProfile.objects.select_related("user")

    # -------------------------
    # SERIALIZER SELECTION
    # -------------------------
    def get_serializer_class(self):
        if self.action == "create":
            return RegisterTaaskrSerializer

        if self.action in ["update", "partial_update"]:
            return UpdateTaaskrSerializer

        return TaaskrReadSerializer

    # -------------------------
    # PERMISSIONS
    # -------------------------
    def get_permissions(self):
        if self.action == "create":
            permission_classes = [AllowAny]

        elif self.action in ["list", "retrieve"]:
            permission_classes = [IsAuthenticated, HasCustomPermission]
            HasCustomPermission.required_permissions = "taaskr.view"

        elif self.action in ["update", "partial_update"]:
            permission_classes = [IsAuthenticated, HasCustomPermission]
            HasCustomPermission.required_permissions = "taaskr.update"

        elif self.action == "destroy":
            permission_classes = [IsAuthenticated, HasCustomPermission]
            HasCustomPermission.required_permissions = "taaskr.delete"

        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    # -------------------------
    # CREATE
    # -------------------------
    def perform_create(self, serializer):
        serializer.save()

    # -------------------------
    # UPDATE (IMPORTANT FIX)
    # -------------------------
    def update(self, request, *args, **kwargs):
        profile = self.get_object()        # TaaskrProfile
        user = profile.user                # User instance

        serializer = self.get_serializer(
            instance=user,
            data=request.data,
            partial=False
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(TaaskrReadSerializer(profile).data)

    def partial_update(self, request, *args, **kwargs):
        profile = self.get_object()
        user = profile.user

        serializer = self.get_serializer(
            instance=user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(TaaskrReadSerializer(profile).data)

    # -------------------------
    # DELETE
    # -------------------------
    def perform_destroy(self, instance):
        user = instance.user
        instance.delete()
        user.delete()

    # -------------------------
    # ME ENDPOINT
    # -------------------------

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        profile = get_object_or_404(TaaskrProfile, user=request.user)
        serializer = TaaskrReadSerializer(profile)
        return Response(serializer.data)

   # -------------------------
    # VERIFY TAASKR ENDPOINT
    # -------------------------
    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[IsAuthenticated, HasCustomPermission],
    )
    def verify(self, request, pk=None):
        """
        PATCH /taaskrcrud/{id}/verify/
        Toggle taaskr verification status
        """
        HasCustomPermission.required_permissions = "taaskr.verify"

        taaskr = self.get_object()
        taaskr.verified = not taaskr.verified
        taaskr.save(update_fields=["verified"])

        return Response(
            {
                "id": taaskr.id,
                "verified": taaskr.verified,
                "message": "Taaskr verification status updated",
            },
            status=status.HTTP_200_OK,
        )
