from django.http import Http404
from rest_framework.decorators import api_view, action
from rest_framework import viewsets, permissions, authentication, generics
from rest_framework.response import Response
from user.models import Doctor, DoctorProfile
from user.serializers import DoctorSerializer


class DoctorList(generics.ListAPIView):
    serializer_class = DoctorSerializer
    authentication_classes = [
        authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods='get')
    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = Doctor.objects.all()
        username = self.request.query_params.get('username')
        if username is not None:
            queryset = queryset.filter(purchaser__username=username)
        return
