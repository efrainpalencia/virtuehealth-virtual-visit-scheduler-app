from django.db import models
from user.models import Patient


class LabTest(models.Model):
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    description = models.TextField()

    class TestType(models.TextChoices):
        BLOOD = "BLOOD", "blood test"
        FECAL = "FECAL", "fecal"
        SEMEN = "SEMEN", "semen"
        TUMOR_MARKERS = "TUMOR_MARKERS", "tumor markers"
        URINE = "URINE", "urine test"

    test_type = models.CharField(
        max_length=100, choices=TestType.choices, null=True, blank=False)
    lab = models.CharField(max_length=100)
    lab_document = models.FileField(upload_to='lab_documents/')

    def __str__(self):
        return f"Lab Test: {self.test_type} for {self.patient.user.email} at {self.lab}"
