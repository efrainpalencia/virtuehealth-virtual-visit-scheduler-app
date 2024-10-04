from rest_framework import viewsets, permissions
from user.permissions import IsDoctor, IsPatient
from medical_records.serializers import MedicalRecordSerializer
from user.models import Patient, PatientProfile
from user.serializers import PatientSerializer, PatientProfileSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.patient.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.AllowAny]


# class PatientProfileViewSet(viewsets.ModelViewSet):
#     queryset = PatientProfile.objects.all()
#     serializer_class = PatientProfileSerializer
#     permission_classes = [permissions.AllowAny]
