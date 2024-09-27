from django.contrib.auth.models import User
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import RegexValidator


class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialty = models.CharField(max_length=100, null=True, blank=True)
    phone_number = models.CharField(max_length=15, validators=[RegexValidator(
        regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")], null=True, blank=True)
    fax_number = models.CharField(max_length=15, validators=[RegexValidator(
        regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")], null=True, blank=True)
    languages = models.TextField(null=True, blank=True)
    insurance_provider = models.TextField(null=True, blank=True)
    schedule = ArrayField(models.DateTimeField(), blank=True, null=True)

    def __str__(self):
        return self.user.email


class MedicalRecord(models.Model):
    patient = models.OneToOneField(
        'patient_portal.Patient', on_delete=models.CASCADE, related_name='medical_record_detail')
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
