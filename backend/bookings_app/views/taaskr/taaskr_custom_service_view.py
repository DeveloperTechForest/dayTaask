from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from bookings_app.models import AssignmentLog
from bookings_app.serializers.taaskr.taaskr_custom_service_serializer import (
    TaaskrCustomServiceCreateSerializer,
)


class TaaskrCustomServiceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TaaskrCustomServiceCreateSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        booking = serializer.validated_data["booking_id"]
        has_assignment = AssignmentLog.objects.filter(
            booking=booking,
            taaskr=request.user,
        ).exists()

        if not has_assignment:
            return Response(
                {"detail": "You are not assigned to this booking"},
                status=status.HTTP_403_FORBIDDEN,
            )

        custom_service = serializer.save()
        return Response(
            {
                "custom_service_id": custom_service.id,
                "status": custom_service.status,
                "message": "Service change sent to customer",
            },
            status=status.HTTP_201_CREATED,
        )
