from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer


class MedicalRecordViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Retrieve the appropriate medical records based on user role."""
        user = self.request.user
        print(f"Fetching queryset for user: {user.id}, role: {user.role}")
        if user.role == 'DOCTOR':
            # Doctor can view all medical records
            return MedicalRecord.objects.all()
        elif user.role == 'PATIENT':
            # Patient can only view their own medical record
            return MedicalRecord.objects.filter(patient=user.id)
        return MedicalRecord.objects.none()

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a single medical record with role-based access."""
        user = request.user
        instance = self.get_object()

        # Check if user is authorized to view the record
        if user.role == 'DOCTOR' or (user.role == 'PATIENT' and instance.patient.id == user.id):
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        return Response(
            {"detail": "Not authorized to view this record."},
            status=status.HTTP_403_FORBIDDEN
        )

    def create(self, request, *args, **kwargs):
        """Create a medical record ensuring no duplicate records for a patient."""
        patient_id = request.data.get('patient')
        if MedicalRecord.objects.filter(patient_id=patient_id).exists():
            return Response(
                {"error": "A medical record already exists for this patient."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """Handle PATCH requests for updating part of a medical record."""
        user = request.user
        instance = self.get_object()

        # Ensure patients can only update their own record
        if user.role == 'DOCTOR' or (user.role == 'PATIENT' and instance.patient.id == user.id):
            serializer = self.get_serializer(
                instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            {"detail": "Not authorized to update this record."},
            status=status.HTTP_403_FORBIDDEN
        )

    def destroy(self, request, *args, **kwargs):
        """Handle DELETE requests for deleting a medical record."""
        user = request.user
        instance = self.get_object()

        # Ensure patients can only delete their own record
        if user.role == 'DOCTOR' or (user.role == 'PATIENT' and instance.patient.id == user.id):
            self.perform_destroy(instance)
            return Response(
                {"detail": "Medical record deleted successfully."},
                status=status.HTTP_204_NO_CONTENT
            )

        return Response(
            {"detail": "Not authorized to delete this record."},
            status=status.HTTP_403_FORBIDDEN
        )
