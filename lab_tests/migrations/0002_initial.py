# Generated by Django 5.1.1 on 2024-09-30 20:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('lab_tests', '0001_initial'),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='labtest',
            name='patient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.patient'),
        ),
    ]