from .models import Appointment
from rest_framework import viewsets, permissions, authentication
from .serializers import AppointmentSerializer


class AppointmentViewset(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [
        authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]
