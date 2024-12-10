from django.db import models
from user.models import Doctor, Patient


class Appointment(models.Model):
    patient_id = models.ForeignKey(
        Patient, on_delete=models.CASCADE, related_name='patient_appointments')
    doctor_id = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name='doctor_appointments')
    date = models.DateTimeField()

    class Reason(models.TextChoices):
        CHRONIC_CARE = "CHRONIC_CARE", "Chronic Care"
        PREVENTATIVE_CARE = "PREVENTATIVE_CARE", "Preventative Care"
        SURGICAL_POST_OP = "SURGICAL_POST_OP", "Surgical Post-op"
        OTHER = "OTHER", "Other"

    reason = models.CharField(
        max_length=500, choices=Reason.choices, default='OTHER', null=True)

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        COMPLETED = "COMPLETED", "Completed"
        CANCELED = "CANCELED", "Canceled"

    status = models.CharField(
        max_length=500, choices=Status.choices, default='PENDING', null=True, blank=False)

    def __str__(self):
        return f"Appointment with Dr. {self.doctor.user.last_name} for {self.patient.user.email} on {self.date} - Status: {self.status}"
