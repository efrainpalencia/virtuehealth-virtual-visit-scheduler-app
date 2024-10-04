# Generated by Django 5.1.1 on 2024-10-04 15:32

import datetime
import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_alter_doctorprofile_schedule'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doctorprofile',
            name='schedule',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.DateTimeField(), default=datetime.datetime, size=None),
        ),
    ]
