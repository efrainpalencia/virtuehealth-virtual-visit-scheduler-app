from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer


class MedicalRecordViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'DOCTOR':
            # Doctor can view all medical records
            return MedicalRecord.objects.all()
        elif user.role == 'PATIENT':
            # Patient can only view their own medical record
            return MedicalRecord.objects.filter(patient=user.id)
        return MedicalRecord.objects.none()

    def retrieve(self, request, *args, **kwargs):
        # Ensure retrieval is limited to the patient’s own record
        user = request.user
        instance = self.get_object()

        # Check if user is a doctor or if the patient owns the record
        if user.role == 'DOCTOR' or (user.role == 'PATIENT' and instance.patient.id == user.id):
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        return Response(
            {"detail": "Not authorized to view this record."},
            status=status.HTTP_403_FORBIDDEN
        )

    def create(self, request, *args, **kwargs):
        # Restrict to one medical record per patient
        patient_id = request.data.get('patient')
        if MedicalRecord.objects.filter(patient_id=patient_id).exists():
            return Response(
                {"error": "A medical record already exists for this patient."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)
