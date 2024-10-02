from django.core.validators import RegexValidator
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", 'admin'
        DOCTOR = "DOCTOR", 'doctor'
        PATIENT = "PATIENT", 'patient'

    base_role = Role.ADMIN

    role = models.CharField(max_length=50, choices=Role.choices)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
            return super().save(*args, **kwargs)


# class Patient(models.Model):
#     user = models.OneToOneField(
#         User, on_delete=models.CASCADE, related_name='patient')
#     date_of_birth = models.DateField(null=True, blank=True)
#     ethnicity = models.TextField(null=True, blank=True)
#     location = models.TextField(null=True, blank=True)
#     address = models.TextField(null=True, blank=True)
#     phone_number = models.CharField(max_length=15, validators=[RegexValidator(
#         regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")], null=True, blank=True)
#     medical_record = models.OneToOneField(
#         'doctor_dashboard.MedicalRecord', on_delete=models.CASCADE, null=True, blank=True, related_name='patient_medical_record')

#     def __str__(self):
#         return self.user.email


# class Doctor(models.Model):
#     user = models.OneToOneField(
#         User, on_delete=models.CASCADE, related_name='doctor')
#     specialty = models.CharField(max_length=100, null=True, blank=True)
#     phone_number = models.CharField(max_length=15, validators=[RegexValidator(
#         regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")], null=True, blank=True)
#     fax_number = models.CharField(max_length=15, validators=[RegexValidator(
#         regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")], null=True, blank=True)
#     languages = models.TextField(null=True, blank=True)
#     insurance_provider = models.TextField(null=True, blank=True)
#     schedule = ArrayField(models.DateTimeField(), blank=True, null=True)

#     def __str__(self):
#         return self.user.email
