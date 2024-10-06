from django.http import Http404
from rest_framework import generics, viewsets, permissions, authentication
from rest_framework.decorators import action
from medical_records.serializers import MedicalRecordSerializer
from user.models import Patient, PatientProfile
from user.serializers import PatientSerializer, PatientProfileSerializer, UserSerializer

from rest_framework.views import APIView
from rest_framework.response import Response


class PatientViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Patient.patient.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.AllowAny]
