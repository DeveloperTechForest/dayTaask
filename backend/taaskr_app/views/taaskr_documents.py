# taaskr_app/views/taaskr_documents.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from taaskr_app.models.profile import TaaskrProfile
from taaskr_app.serializers.taaskr_serializer import TaaskrReadSerializer


class TaaskrDocumentsView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        profile = TaaskrProfile.objects.filter(user=request.user).first()
        if not profile:
            return Response({"detail": "Taaskr profile not found"}, status=404)

        if "government_id_image" in request.data:
            profile.government_id_image = request.data.get("government_id_image")
        if "id_proof_image" in request.data:
            profile.government_id_image = request.data.get("id_proof_image")
        if "address_proof_image" in request.data:
            profile.address_proof_image = request.data.get("address_proof_image")
        if "profile_photo_image" in request.data:
            profile.profile_photo_image = request.data.get("profile_photo_image")

        profile.save()
        return Response(TaaskrReadSerializer(profile, context={"request": request}).data)
