from datetime import datetime
from django.core.validators import RegexValidator
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserManager(BaseUserManager):
    """
    Defines how the User(or the model to which attached)
    will create users and superusers.
    """

    def create_user(
        self,
        email,
        password,
        date_of_birth,
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
            date_of_birth=date_of_birth,
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
        date_of_birth,
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
            date_of_birth,
            **extra_fields
        )


class User(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    date_of_birth = models.DateField(
        verbose_name="Birthday",
        null=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
        "date_of_birth"
    ]

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

    objects = UserManager()

    def __str__(self):
        return self.email


class DoctorManager(UserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.DOCTOR)


class Doctor(User):
    base_role = User.Role.DOCTOR
    is_superuser = False

    doctor = DoctorManager()

    class Meta:
        proxy = True


@receiver(post_save, sender=Doctor)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == "DOCTOR":
        DoctorProfile.objects.create(user=instance)


class DoctorProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='doctor_profile')
    doctor_id = models.IntegerField(null=True, blank=True)
    specialty = models.CharField(max_length=100, null=True, blank=True)
    phone_number = models.CharField(max_length=15, validators=[RegexValidator(
        regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '9999999999'. Up to 15 digits allowed.")], null=True, blank=True)
    fax_number = models.CharField(max_length=15, validators=[RegexValidator(
        regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '9999999999'. Up to 15 digits allowed.")], null=True, blank=True)
    languages = models.TextField(null=True, blank=True)
    insurance_provider = models.TextField(null=True, blank=True)
    schedule = ArrayField(models.DateTimeField(),
                          default=datetime.now)

    def __str__(self):
        return self.user.email


class PatientManager(UserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.PATIENT)


class Patient(User):
    base_role = User.Role.PATIENT
    is_superuser = False
    is_staff = False

    patient = PatientManager()

    class Meta:
        proxy = True


@receiver(post_save, sender=Patient)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == "PATIENT":
        PatientProfile.objects.create(user=instance)


class PatientProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='patient_profile')
    patient_id = models.IntegerField(null=True, blank=True)
    ethnicity = models.TextField(null=True, blank=True)
    location = models.TextField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, validators=[RegexValidator(
        regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '9999999999'. Up to 15 digits allowed.")], null=True, blank=True)
    medical_record = models.OneToOneField(
        'medical_records.MedicalRecord', on_delete=models.CASCADE, null=True, blank=True, related_name='patient_medical_record')

    def __str__(self):
        return self.user.email
