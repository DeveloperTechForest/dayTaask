# payments_app/views/customer/confirm_cod.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from payments_app.serializers.customer.confirm_cod_serializer import ConfirmCODSerializer


class ConfirmCODView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ConfirmCODSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        return Response({
            "message": "COD confirmed",
            "booking_id": booking.id,
            "payment_status": booking.payment_status,
            "status": booking.status,
        })
