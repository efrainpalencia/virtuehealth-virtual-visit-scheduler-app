# Generated by Django 5.1.1 on 2024-11-24 15:16

import django.contrib.postgres.fields
import django.core.validators
import django.db.models.deletion
import django.db.models.manager
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('medical_records', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(
                    max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(
                    blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False,
                 help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('is_staff', models.BooleanField(default=False,
                 help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(
                    default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(
                    default=django.utils.timezone.now, verbose_name='date joined')),
                ('first_name', models.CharField(
                    blank=True, max_length=100, null=True)),
                ('last_name', models.CharField(
                    blank=True, max_length=100, null=True)),
                ('email', models.EmailField(max_length=254,
                 unique=True, verbose_name='email address')),
                ('date_of_birth', models.DateField(
                    null=True, verbose_name='Date of Birth')),
                ('role', models.CharField(choices=[
                 ('ADMIN', 'admin'), ('DOCTOR', 'doctor'), ('PATIENT', 'patient')], max_length=50)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
                 related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.',
                 related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='DoctorProfile',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True,
                 related_name='doctor_profile', serialize=False, to=settings.AUTH_USER_MODEL)),
                ('specialty', models.CharField(choices=[('GENERAL_DOCTOR', 'general doctor'), ('CARDIOLOGIST', 'cardiologist'), ('ORTHOPEDIST', 'orthopedist'), (
                    'NEUROLIGIST', 'neurologist'), ('PSYCHIATRIST', 'psychiatrist'), ('PEDIATRICIAON', 'pediatrician')], max_length=250, null=True)),
                ('location', models.TextField(blank=True, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=15, null=True, validators=[django.core.validators.RegexValidator(
                    message="Phone number must be entered in the format: '9999999999'. Up to 15 digits allowed.", regex='^\\+?1?\\d{9,15}$')])),
                ('fax_number', models.CharField(blank=True, max_length=15, null=True, validators=[django.core.validators.RegexValidator(
                    message="Phone number must be entered in the format: '9999999999'. Up to 15 digits allowed.", regex='^\\+?1?\\d{9,15}$')])),
                ('languages', models.TextField(blank=True, null=True)),
                ('schedule', django.contrib.postgres.fields.ArrayField(
                    base_field=models.DateTimeField(), default=list, size=None)),
                ('medical_school', models.TextField(blank=True, null=True)),
                ('residency_program', models.TextField(blank=True, null=True)),
                ('img_url', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Doctor',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('user.user',),
            managers=[
                ('doctor', django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name='Patient',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('user.user',),
            managers=[
                ('patient', django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name='PatientProfile',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True,
                 related_name='patient_profile', serialize=False, to=settings.AUTH_USER_MODEL)),
                ('race_ethnicity', models.CharField(blank=True, choices=[('WHITE', 'White (not of Hispanic origin)'), ('BLACK', 'Black (not of Hispanic origin)'), ('HISPANIC_LATINO', 'Hispanic or Latino'), (
                    'ASIAN', 'Asian'), ('AMERICAN_INDIAN_NATIVE_ALASKAN', 'American Indian or Alaska Native'), ('NATIVE_HAWAIIAN_PACIFIC_ISLANDER', 'Native Hawaiian or Pacific Islander')], max_length=250, null=True)),
                ('gender', models.CharField(blank=True, choices=[
                 ('MALE', 'Male'), ('FEMALE', 'Female')], max_length=6, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=15, null=True, validators=[django.core.validators.RegexValidator(
                    message="Phone number must be entered in the format: '9999999999'. Up to 15 digits allowed.", regex='^\\+?1?\\d{9,15}$')])),
                ('insurance_provider', models.TextField(blank=True, null=True)),
                ('img_url', models.TextField(blank=True, null=True)),
                ('emergency_name', models.CharField(
                    blank=True, max_length=250, null=True)),
                ('emergency_contact', models.CharField(blank=True, max_length=15, null=True, validators=[django.core.validators.RegexValidator(
                    message="Phone number must be entered in the format: '9999999999'. Up to 15 digits allowed.", regex='^\\+?1?\\d{9,15}$')])),
                ('emergency_relationship', models.CharField(
                    blank=True, max_length=250, null=True)),
                ('medical_record', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE,
                 related_name='patient_medical_record', to='medical_records.medicalrecord')),
            ],
        ),
    ]
