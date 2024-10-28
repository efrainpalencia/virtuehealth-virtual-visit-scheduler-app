# Generated by Django 5.1.1 on 2024-10-28 01:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0004_alter_appointment_reason_alter_appointment_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='reason',
            field=models.CharField(choices=[('CHRONIC_CARE', 'chronic care'), ('PREVENTATIVE_CARE', 'preventative care'), ('SURGICAL_POST_OP', 'surgical post-op'), ('OTHER', 'other')], default='OTHER', max_length=100, null=True),
        ),
    ]
