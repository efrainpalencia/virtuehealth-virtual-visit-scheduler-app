from datetime import timedelta, datetime
from django.utils import timezone
from django.conf import settings
from user.models import Doctor, Patient, DoctorProfile
from .models import Appointment
from rest_framework import viewsets, permissions, authentication, status
from rest_framework.response import Response
from django.db import transaction
from .serializers import AppointmentSerializer


class AppointmentViewset(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [
        authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]
