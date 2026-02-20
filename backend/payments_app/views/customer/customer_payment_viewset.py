# payments_app/views/customer/customer_payment_viewset.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from payments_app.models import Payment
from payments_app.serializers.customer.payment_list_serializer import (
    CustomerPaymentListSerializer
)
from payments_app.serializers.customer.payment_detail_serializer import (
    CustomerPaymentDetailSerializer
)
from payments_app.serializers.customer.create_payment_order_serializer import (
    CreatePaymentOrderSerializer
)
from payments_app.serializers.customer.verify_payment_serializer import (
    VerifyPaymentSerializer
)


class CustomerPaymentViewSet(ModelViewSet):

    permission_classes = [IsAuthenticated]

    queryset = Payment.objects.select_related(
        "booking"
    ).order_by("-created_at")

    # ---------------------------
    # SERIALIZER SWITCH
    # ---------------------------
    def get_serializer_class(self):

        if self.action == "create_order":
            return CreatePaymentOrderSerializer

        if self.action == "verify":
            return VerifyPaymentSerializer

        if self.action == "retrieve":
            return CustomerPaymentDetailSerializer

        return CustomerPaymentListSerializer

    # ---------------------------
    # LIMIT TO OWN PAYMENTS
    # ---------------------------
    def get_queryset(self):
        return self.queryset.filter(
            booking__customer=self.request.user
        )

    # ---------------------------
    # CREATE RAZORPAY ORDER
    # ---------------------------
    @action(detail=False, methods=["post"])
    def create_order(self, request):

        serializer = self.get_serializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        data = serializer.save()

        return Response(data, status=status.HTTP_201_CREATED)

    # ---------------------------
    # VERIFY PAYMENT
    # ---------------------------
    @action(detail=False, methods=["post"])
    def verify(self, request):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payment = serializer.save()

        return Response({
            "detail": "Payment verified",
            "payment_id": payment.id,
        })
