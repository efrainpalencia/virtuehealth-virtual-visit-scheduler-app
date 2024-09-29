from django.contrib.auth import get_user_model
from django.db import models
from django.core.validators import RegexValidator

User = get_user_model()


class Patient(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='patient')
    date_of_birth = models.DateField(null=True, blank=True)
    ethnicity = models.TextField(null=True, blank=True)
    location = models.TextField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, validators=[RegexValidator(
        regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")], null=True, blank=True)
    medical_record = models.OneToOneField(
        'doctor_dashboard.MedicalRecord', on_delete=models.CASCADE, null=True, blank=True, related_name='patient_medical_record')

    def __str__(self):
        return self.user.email
