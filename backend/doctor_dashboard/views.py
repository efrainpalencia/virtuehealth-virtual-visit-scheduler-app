from django.http import Http404
from rest_framework import viewsets, permissions, authentication
from rest_framework.decorators import api_view
from rest_framework.response import Response
from medical_records.serializers import MedicalRecordSerializer
from user.models import Doctor, Patient, PatientProfile
from user.serializers import PatientSerializer, DoctorSerializer, UserSerializer


class DoctorDashboardView(viewsets.ReadOnlyModelViewSet):
    queryset = Patient.patient.all()
    serializer_class = PatientSerializer
    authentication_classes = [
        authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
