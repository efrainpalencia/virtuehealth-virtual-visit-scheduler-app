from django.core.validators import RegexValidator
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models


class User(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_groups',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if hasattr(self, 'doctor'):
            group, created = Group.objects.get_or_create(name='Doctors')
            self.groups.add(group)
        elif hasattr(self, 'patient'):
            group, created = Group.objects.get_or_create(name='Patients')
            self.groups.add(group)


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


class Doctor(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='doctor')
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
