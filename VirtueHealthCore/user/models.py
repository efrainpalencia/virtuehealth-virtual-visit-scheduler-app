from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.postgres.fields import ArrayField
from django.db import models

from django.core.validators import RegexValidator


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    user_type = models.CharField(max_length=10, choices=[(
        'admin', 'Admin'), ('patient', 'Patient'), ('doctor', 'Doctor')], default='patient')
    admin_level = models.IntegerField(null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    specialty = models.CharField(max_length=100, null=True, blank=True)
    ethnicity = models.TextField(null=True, blank=True)
    location = models.TextField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, validators=[RegexValidator(
        regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")], null=True, blank=True)
    fax_number = models.CharField(max_length=15, validators=[RegexValidator(
        regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")], null=True, blank=True)
    languages = models.TextField(null=True, blank=True)
    insurance_provider = models.TextField(null=True, blank=True)
    schedule = ArrayField(models.DateTimeField(), blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'date_of_birth']

    def __str__(self):
        return self.email


class Appointment(models.Model):
    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                related_name='appointments', limit_choices_to={'user_type': 'patient'})
    doctor = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                               related_name='appointments', limit_choices_to={'user_type': 'doctor'})
    date = models.DateTimeField()
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), (
        'complete', 'Complete'), ('canceled', 'Canceled')], default='pending')

    def __str__(self):
        return f"Appointment with Dr. {self.doctor.last_name} for {self.patient.email} on {self.date} - Status: {self.status}"


class LabTest(models.Model):
    patient = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, limit_choices_to={'user_type': 'patient'})
    test_type = models.CharField(max_length=100)
    lab = models.CharField(max_length=100)
    lab_document = models.BinaryField()

    def __str__(self):
        return f"Lab Test: {self.test_type} for {self.patient.email} at {self.lab}"


class MedicalRecord(models.Model):
    patient = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, limit_choices_to={'user_type': 'patient'})
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
        return f"Medical Record for {self.patient.email}"
