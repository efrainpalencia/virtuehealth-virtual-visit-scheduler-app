from .models import Doctor, MedicalRecord
from rest_framework import viewsets
from rest_framework import generics, permissions
from .serializers import DoctorSerializer, MedicalRecordSerializer


class DoctorViewSet(generics.ListAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.AllowAny]


class DoctorDetailView(generics.RetrieveUpdateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.AllowAny]


class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.AllowAny]
