from django.db import models
from patient_portal.models import Patient
from doctor_dashboard.models import Doctor


class Appointment(models.Model):
    patient = models.ForeignKey(
        Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateTimeField()
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), (
        'complete', 'Complete'), ('canceled', 'Canceled')], default='pending')

    def __str__(self):
        return f"Appointment with Dr. {self.doctor.user.last_name} for {self.patient.user.email} on {self.date} - Status: {self.status}"
