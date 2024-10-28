from django.db import models
from user.models import Doctor, Patient


class Appointment(models.Model):
    patient_id = models.ForeignKey(
        Patient, on_delete=models.CASCADE, related_name='patient_appointments')
    doctor_id = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name='doctor_appointments')
    date = models.DateTimeField()

    class Reason(models.TextChoices):
        CHRONIC_CARE = "CHRONIC_CARE", "chronic care"
        PREVENTATIVE_CARE = "PREVENTATIVE_CARE", "preventative care"
        SURGICAL_POST_OP = "SURGICAL_POST_OP", "surgical post-op"
        OTHER = "OTHER", "other"

    reason = models.CharField(
        max_length=100, choices=Reason.choices, default='OTHER', null=True)

    class Status(models.TextChoices):
        PENDING = "PENDING", "pending"
        COMPLETED = "COMPLETED", "completed"
        CANCELED = "CANCELED", "canceled"

    status = models.CharField(
        max_length=10, choices=Status.choices, default='PENDING', null=True, blank=False)

    def __str__(self):
        return f"Appointment with Dr. {self.doctor.user.last_name} for {self.patient.user.email} on {self.date} - Status: {self.status}"
