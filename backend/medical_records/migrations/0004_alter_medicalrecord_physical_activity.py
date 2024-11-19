# Generated by Django 5.1.1 on 2024-11-19 01:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medical_records', '0003_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medicalrecord',
            name='physical_activity',
            field=models.CharField(choices=[('NONE', 'None'), ('ONE_TO_THREE_DAYS', 'One to Three Days'), ('THREE_OR_MORE', 'Three or More Days')], max_length=251, null=True),
        ),
    ]
