from rest_framework import generics, permissions, authentication
from user.permissions import IsAdmin, IsDoctor
from user.models import Doctor
from user.serializers import DoctorSerializer


class DoctorList(generics.ListAPIView):
    serializer_class = DoctorSerializer
    authentication_classes = [
        authentication.SessionAuthentication,
        authentication.TokenAuthentication
    ]
    permission_classes = [permissions.IsAuthenticated, IsAdmin, IsDoctor]

    def get_queryset(self):
        queryset = Doctor.objects.all()
        username = self.request.query_params.get("username")
        if username:
            queryset = queryset.filter(user__username=username)
        return queryset
