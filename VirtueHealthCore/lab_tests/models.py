from django.db import models
from patient_portal.models import Patient


class LabTest(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    test_type = models.CharField(max_length=100)
    lab = models.CharField(max_length=100)
    lab_document = models.BinaryField()

    def __str__(self):
        return f"Lab Test: {self.test_type} for {self.patient.user.email} at {self.lab}"
