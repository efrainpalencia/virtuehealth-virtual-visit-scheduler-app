from rest_framework import viewsets, permissions
from user.permissions import IsDoctor, IsPatient
from medical_records.serializers import MedicalRecordSerializer
from user.models import Patient
from user.serializers import PatientSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctor]
