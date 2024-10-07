# Generated by Django 5.1.1 on 2024-10-07 13:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0010_remove_patientprofile_location_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patientprofile',
            name='ethnicity',
        ),
        migrations.AddField(
            model_name='patientprofile',
            name='race_ethnicity',
            field=models.CharField(blank=True, choices=[('WHITE', 'White (not of Hispanic origin)'), ('BLACK', 'Black (not of Hispanic origin)'), ('HISPANIC_LATINO', 'Hispanic or Latino'), ('ASIAN', 'Asian'), ('AMERICAN_INDIAN_NATIVE_ALASKAN', 'American Indian or Alaska Native'), ('NATIVE_HAWAIIAN_PACIFIC_ISLANDER', 'Native Hawaiian or Pacific Islander')], max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='doctorprofile',
            name='specialty',
            field=models.CharField(blank=True, choices=[('GENERAL_DOCTOR', 'general doctor'), ('CARDIOLOGIST', 'cardiologist'), ('ORTHOPEDIST', 'orthopedist'), ('NEUROLIGIST', 'neurologist'), ('PSYCHIATRIST', 'psychiatrist'), ('PEDIATRICIAON', 'pediatrician')], max_length=100, null=True),
        ),
    ]