from rest_framework import generics, permissions, authentication
from user.models import Patient
from user.serializers import PatientSerializer


class PatientList(generics.ListAPIView):
    """
    API view to list patients, optionally filtered by user role or specific criteria.
    """
    serializer_class = PatientSerializer
    authentication_classes = [
        authentication.SessionAuthentication,
        authentication.TokenAuthentication,
    ]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Restricts returned patients based on the user's role or query parameters.
        """
        user = self.request.user
        queryset = Patient.objects.all()

        # Filter patients based on the role of the authenticated user
        if user.role == "DOCTOR":
            # Example: Filter patients managed by this doctor (if applicable)
            queryset = queryset.filter(doctor=user.id)
        elif user.role == "PATIENT":
            # Return only the current patient's data
            queryset = queryset.filter(id=user.id)
        elif user.role == "ADMIN":
            # Admin can view all patients (no filtering)
            return queryset
        else:
            queryset = queryset.none()  # No access for unauthorized roles

        # Optional filtering based on query parameters
        username = self.request.query_params.get("username")
        if username:
            queryset = queryset.filter(user__username=username)

        return queryset
