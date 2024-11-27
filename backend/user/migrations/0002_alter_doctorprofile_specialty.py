# Generated by Django 5.1.1 on 2024-11-27 03:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doctorprofile',
            name='specialty',
            field=models.CharField(choices=[('GENERAL_DOCTOR', 'general doctor'), ('CARDIOLOGIST', 'cardiologist'), ('ORTHOPEDIST', 'orthopedist'), ('NEUROLOGIST', 'neurologist'), ('PSYCHIATRIST', 'psychiatrist'), ('PEDIATRICIAON', 'pediatrician')], max_length=250, null=True),
        ),
    ]
