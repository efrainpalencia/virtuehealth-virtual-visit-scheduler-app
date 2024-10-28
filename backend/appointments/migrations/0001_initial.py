# Generated by Django 5.1.1 on 2024-10-28 15:02

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField()),
                ('reason', models.CharField(choices=[('CHRONIC_CARE', 'Chronic Care'), ('PREVENTATIVE_CARE', 'Preventative Care'), ('SURGICAL_POST_OP', 'Surgical Post-op'), ('OTHER', 'Other')], default='OTHER', max_length=500, null=True)),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('COMPLETED', 'Completed'), ('CANCELED', 'Canceled')], default='PENDING', max_length=500, null=True)),
            ],
        ),
    ]
