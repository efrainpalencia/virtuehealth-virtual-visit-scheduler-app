# Generated by Django 5.1.1 on 2024-12-09 23:27

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doctorprofile',
            name='schedule',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.DateTimeField(blank=True, null=True), blank=True, default=list, null=True, size=None),
        ),
    ]
