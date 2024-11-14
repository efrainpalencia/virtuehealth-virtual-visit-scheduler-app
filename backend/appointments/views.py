from datetime import timedelta, datetime
from django.utils import timezone
from django.conf import settings
from user.models import Doctor, Patient, DoctorProfile
from .models import Appointment
from rest_framework import viewsets, permissions, authentication, status
from rest_framework.response import Response
from django.db import transaction
from .serializers import AppointmentSerializer
from VirtueHealthCore.utils import send_appointment_confirmation
from rest_framework.decorators import action


class AppointmentViewset(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [
        authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def book_appointment(self, request):
        doctor = Doctor.objects.get(id=request.data.get("doctor_id"))
        patient = Patient.objects.get(id=request.data.get("patient_id"))
        appointment_time = request.data.get("date")

        if appointment_time in doctor.doctor_profile.schedule:
            appointment = Appointment.objects.create(
                patient_id=patient.id,
                doctor_id=doctor.id,
                date=appointment_time,
                reason=request.data.get("reason", "OTHER"),
                status="PENDING"
            )

            doctor.doctor_profile.schedule.remove(appointment_time)
            doctor.doctor_profile.save()

            appointment_details = {
                "date": appointment.date.strftime("%Y-%m-%d %H:%M"),
                "time": appointment.date.strftime("%H:%M"),
                "doctor_name": doctor.get_full_name(),
                "location": doctor.doctor_profile.location
            }

            transaction.on_commit(lambda: send_appointment_confirmation(
                patient.email, doctor.email, appointment_details
            ))

            return Response({"message": "Appointment booked successfully."}, status=status.HTTP_201_CREATED)
        return Response({"message": "Selected time slot is not available."}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], url_path='reschedule')
    def reschedule_appointment(self, request, pk=None):
        appointment = self.get_object()
        doctor_profile = DoctorProfile.objects.get(id=appointment.doctor_id)
        new_date = request.data.get('new_date')

        try:
            new_date_obj = datetime.fromisoformat(
                new_date.replace("Z", "+00:00")).astimezone(timezone.utc)
        except ValueError:
            return Response({"error": "Invalid date format."}, status=status.HTTP_400_BAD_REQUEST)

        old_date = appointment.date
        doctor_profile.schedule.append(old_date)
        doctor_profile.schedule = [
            date for date in doctor_profile.schedule if date != new_date_obj]
        doctor_profile.save()

        appointment.date = new_date_obj
        appointment.save()

        appointment_details = {
            "date": new_date_obj.strftime("%Y-%m-%d %H:%M"),
            "doctor_name": appointment.doctor.get_full_name(),
            "location": doctor_profile.location
        }
        subject = f"Appointment Rescheduled to {appointment_details['date']}"
        message = (
            f"Your appointment has been rescheduled to {
                appointment_details['date']} "
            f"at {appointment_details['location']} with Dr. {
                appointment_details['doctor_name']}."
        )
        send_email(subject, message, settings.DEFAULT_FROM_EMAIL, [
                   appointment.patient.email, appointment.doctor.email])

        return Response({"message": "Appointment rescheduled successfully."}, status=status.HTTP_200_OK)

    @transaction.atomic
    def cancel_appointment(self, request, appointment_id):
        appointment = Appointment.objects.get(id=appointment_id)
        time_difference = appointment.date - timezone.now()

        if time_difference >= timedelta(minutes=30):
            doctor_profile = appointment.doctor_id.doctor_profile
            doctor_profile.schedule.append(appointment.date)
            doctor_profile.save()

        appointment.status = "CANCELED"
        appointment.save()

        appointment_details = {
            "date": appointment.date.strftime("%Y-%m-%d %H:%M"),
            "doctor_name": appointment.doctor.get_full_name(),
            "location": doctor_profile.location
        }
        subject = "Appointment Canceled"
        message = (
            f"The appointment scheduled for {
                appointment_details['date']} with "
            f"Dr. {appointment_details['doctor_name']} at {
                appointment_details['location']} has been canceled."
        )
        send_email(subject, message, settings.DEFAULT_FROM_EMAIL, [
                   appointment.patient.email, appointment.doctor.email])

        return Response({"message": "Appointment canceled successfully."}, status=status.HTTP_200_OK)
