from rest_framework import generics, viewsets, permissions
from rest_framework.decorators import action
from user.permissions import IsDoctor, IsPatient
from medical_records.serializers import MedicalRecordSerializer
from user.models import Patient, PatientProfile, User
from user.serializers import PatientSerializer, PatientProfileSerializer, UserSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.patient.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.AllowAny]


class PatientList(generics.ListCreateAPIView):
    queryset = Patient.patient.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
