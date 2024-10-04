from django.http import Http404
from rest_framework import viewsets, permissions
from user.models import Doctor, DoctorProfile
from user.serializers import DoctorSerializer


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.doctor.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.AllowAny]
