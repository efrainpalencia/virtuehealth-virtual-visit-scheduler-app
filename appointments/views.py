from .models import Appointment
from rest_framework import viewsets, permissions
from .serializers import AppointmentSerializer


class AppointmentViewset(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
