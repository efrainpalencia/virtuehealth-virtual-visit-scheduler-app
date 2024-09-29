from .models import MedicalRecord
from rest_framework import viewsets, permissions
from user.permissions import IsDoctor, IsPatient
from .serializers import MedicalRecordSerializer
from user.models import Patient
from user.serializers import PatientSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctor]


class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
