from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework import viewsets, permissions, authentication
from rest_framework.response import Response
from user.models import Doctor, DoctorProfile
from user.serializers import DoctorSerializer


class PatientPortalView(viewsets.ReadOnlyModelViewSet):
    queryset = Doctor.doctor.all()
    serializer_class = DoctorSerializer
    authentication_classes = [
        authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]


class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Doctor.doctor.all()
    serializer_class = DoctorSerializer
    authentication_classes = [
        authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
