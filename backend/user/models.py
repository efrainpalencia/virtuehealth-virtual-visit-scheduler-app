
from django.core.validators import RegexValidator
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from VirtueHealthCore import settings


class UserManager(BaseUserManager):
    """
    Defines how the User(or the model to which attached)
    will create users and superusers.
    """

    def create_user(
        self,
        email,
        password,
        **extra_fields
    ):
        """
        Create and save a user with the given email, password,
        and date_of_birth.
        """
        if not email:
            raise ValueError(_("The Email must be set"))
        email = self.normalize_email(email)  # lowercase the domain
        user = self.model(
            email=email,
            **extra_fields
        )
        user.set_password(password)  # hash raw password and set
        user.save()
        return user

    def create_superuser(
        self,
        email,
        password,
        **extra_fields
    ):
        """
        Create and save a superuser with the given email, 
        password, and date_of_birth. Extra fields are added
        to indicate that the user is staff, active, and indeed
        a superuser.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError(
                _("Superuser must have is_staff=True.")
            )
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(
                _("Superuser must have is_superuser=True.")
            )
        return self.create_user(
            email,
            password,
            **extra_fields
        )


class User(AbstractUser):
    username = None
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(_("email address"), unique=True)
    date_of_birth = models.DateField(
        verbose_name="Date of Birth",
        null=True,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Role(models.TextChoices):
        ADMIN = "ADMIN", 'admin'
        DOCTOR = "DOCTOR", 'doctor'
        PATIENT = "PATIENT", 'patient'

    base_role = Role.PATIENT

    role = models.CharField(max_length=50, choices=Role.choices)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
            return super().save(*args, **kwargs)
        else:
            return super().save(*args, **kwargs)

    objects = UserManager()

    def __str__(self):
        return self.email


class DoctorManager(UserManager):
    """
    Define methods and behaviors for the Doctor model here.
    """

    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.DOCTOR)


class Doctor(User):
    base_role = User.Role.DOCTOR

    doctor = DoctorManager()

    class Meta:
        proxy = True


# Pass DoctorProfile instance to Doctor -> User
@receiver(post_save, sender=Doctor)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == "DOCTOR":
        DoctorProfile.objects.create(user=instance)


class DoctorProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_profile', primary_key=True)

    class Specialty(models.TextChoices):
        GENERAL_DOCTOR = "GENERAL_DOCTOR", "general doctor"
        CARDIOLOGIST = "CARDIOLOGIST", "cardiologist"
        ORTHOPEDIST = "ORTHOPEDIST", "orthopedist"
        NEUROLIGIST = "NEUROLIGIST", "neurologist"
        PSYCHIATRIST = "PSYCHIATRIST", "psychiatrist"
        PEDIATRICIAON = "PEDIATRICIAON", "pediatrician"

    specialty = models.CharField(
        max_length=100, choices=Specialty.choices, null=True, blank=False)
    location = models.TextField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, validators=[RegexValidator(
        regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '9999999999'. Up to 15 digits allowed.")], null=True, blank=True)
    fax_number = models.CharField(max_length=15, validators=[RegexValidator(
        regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '9999999999'. Up to 15 digits allowed.")], null=True, blank=True)
    languages = models.TextField(null=True, blank=True)
    schedule = ArrayField(models.DateTimeField(),
                          default=list)
    img_url = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.user.email


class PatientManager(UserManager):
    """
    Add methods and behaviors for the Patient model here.
    """

    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.PATIENT)


class Patient(User):
    base_role = User.Role.PATIENT

    patient = PatientManager()

    class Meta:
        proxy = True


# Pass PatientProfile instance to Patient -> User
@receiver(post_save, sender=Patient)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == "PATIENT":
        PatientProfile.objects.create(user=instance)


class PatientProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_profile', primary_key=True)

    class RaceEthnicity(models.TextChoices):
        WHITE = "WHITE", "White (not of Hispanic origin)"
        BLACK = "BLACK", "Black (not of Hispanic origin)"
        HISPANIC_LATINO = "HISPANIC_LATINO", "Hispanic or Latino"
        ASIAN = "ASIAN", "Asian"
        AMERICAN_INDIAN_NATIVE_ALASKAN = "AMERICAN_INDIAN_NATIVE_ALASKAN", "American Indian or Alaska Native"
        NATIVE_HAWAIIAN_PACIFIC_ISLANDER = "NATIVE_HAWAIIAN_PACIFIC_ISLANDER", "Native Hawaiian or Pacific Islander"

    race_ethnicity = models.CharField(
        max_length=100, choices=RaceEthnicity.choices, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, validators=[RegexValidator(
        regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '9999999999'. Up to 15 digits allowed.")], null=True, blank=True)
    insurance_provider = models.TextField(null=True, blank=True)
    medical_record = models.OneToOneField(
        'medical_records.MedicalRecord', on_delete=models.CASCADE, null=True, blank=True, related_name='patient_medical_record')
    img_url = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.user.email
