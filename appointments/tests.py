from django.test import TestCase
from django.contrib.auth.models import User
from patient_portal.models import Patient
from doctor_dashboard.models import Doctor
from appointments.models import Appointment
from datetime import datetime
from django.utils.timezone import make_aware


class AppointmentModelTest(TestCase):

    def setUp(self):
        self.patient_user = User.objects.create_user(
            username='patientuser', password='testpass', email='patientuser@example.com')
        self.doctor_user = User.objects.create_user(
            username='doctoruser', password='testpass', email='doctoruser@example.com')
        self.patient = Patient.objects.create(user=self.patient_user)
        self.doctor = Doctor.objects.create(
            user=self.doctor_user, specialty='Cardiology')
        self.appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            date=make_aware(datetime(2024, 9, 26, 10, 0)),
            reason='Routine check-up',
            status='pending'
        )

    def test_appointment_creation(self):
        self.assertEqual(self.appointment.patient.user.username, 'patientuser')
        self.assertEqual(self.appointment.doctor.user.username, 'doctoruser')
        self.assertEqual(self.appointment.date, datetime(2024, 9, 26, 10, 0))
        self.assertEqual(self.appointment.reason, 'Routine check-up')
        self.assertEqual(self.appointment.status, 'pending')

    def test_appointment_str(self):
        expected_str = f"Appointment with Dr. {self.doctor.user.last_name} for {
            self.patient.user.email} on {self.appointment.date} - Status: {self.appointment.status}"
        self.assertEqual(str(self.appointment), expected_str)
