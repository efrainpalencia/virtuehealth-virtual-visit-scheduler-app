from datetime import timedelta
from urllib import response
from user.models import Doctor
from .models import Appointment
from rest_framework import viewsets, permissions, authentication
from .serializers import AppointmentSerializer
from django.utils.timezone import now
from django.db import transaction
from rest_framework.decorators import action


class AppointmentViewset(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [
        authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['patch'], url_path='reschedule')
    def reschedule_appointment(self, request, pk=None):
        appointment = self.get_object()
        doctor_profile = DoctorProfile.objects.get(id=appointment.doctor_id)

        new_date = request.data.get('new_date')
        if not new_date:
            return Response({"error": "New date not provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            new_date_obj = datetime.fromisoformat(
                new_date.replace("Z", "+00:00")).astimezone(timezone.utc)
        except ValueError:
            return Response({"error": "Invalid date format."}, status=status.HTTP_400_BAD_REQUEST)

        # Add old date back to doctor's schedule
        old_date = appointment.date
        doctor_profile.schedule.append(old_date)

        # Remove new date from schedule if it's already present
        doctor_profile.schedule = [
            date for date in doctor_profile.schedule if date != new_date_obj
        ]

        doctor_profile.save()
        appointment.date = new_date_obj
        appointment.save()

        return Response({"message": "Appointment rescheduled successfully."}, status=status.HTTP_200_OK)

    @transaction.atomic
    def book_appointment(request):
        # Extract doctor, patient, and time details from the request
        doctor = Doctor.objects.get(id=id)
        appointment_time = request.data.get("date")

        # Check if the time is available in doctor's schedule
        if appointment_time in doctor.doctor_profile.schedule:
            # Create appointment
            appointment = Appointment.objects.create(
                patient_id=id,
                doctor_id=doctor,
                date=appointment_time,
                reason=request.data.get("reason", "OTHER"),
                status="PENDING"
            )

            # Remove the booked time from the doctor's schedule
            doctor.doctor_profile.schedule.remove(appointment_time)
            doctor.doctor_profile.save()

            return response({"message": "Appointment booked successfully."}, status=201)
        else:
            return response({"message": "Selected time slot is not available."}, status=400)

    @transaction.atomic
    def cancel_appointment(request, appointment_id):
        appointment = Appointment.objects.get(id=appointment_id)

        # Calculate time difference
        time_difference = appointment.date - now()

        # If appointment is in the future and at least 30 minutes away
        if time_difference >= timedelta(minutes=30):
            # Add the time back to the doctor's schedule
            doctor_profile = appointment.doctor_id.doctor_profile
            doctor_profile.schedule.append(appointment.date)
            doctor_profile.save()

        # Cancel the appointment
        appointment.status = "CANCELED"
        appointment.save()

        return response({"message": "Appointment canceled successfully."}, status=200)
