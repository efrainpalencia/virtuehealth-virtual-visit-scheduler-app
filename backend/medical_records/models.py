from django.db import models


class MedicalRecord(models.Model):
    patient = models.OneToOneField(
        'user.Patient', on_delete=models.CASCADE, related_name='medical_record_detail')
    height = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True)
    physical_activity = models.TextField(null=True, blank=True)
    psychological_assessment = models.TextField(null=True, blank=True)
    drugs_alcohol = models.TextField(null=True, blank=True)
    medical_condition = models.TextField(null=True, blank=True)
    injury_illness = models.TextField(null=True, blank=True)
    family_history = models.TextField(null=True, blank=True)
    treatment_surgery = models.TextField(null=True, blank=True)
    current_medication = models.TextField(null=True, blank=True)
    allergy = models.TextField(null=True, blank=True)
    side_effects = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Medical Record for {self.patient.user.email}"
