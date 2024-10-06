# Generated by Django 5.1.1 on 2024-10-06 21:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lab_tests', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='labtest',
            name='description',
            field=models.TextField(default=1),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='labtest',
            name='test_type',
            field=models.CharField(choices=[('BLOOD', 'blood test'), ('FECAL', 'fecal'), ('SEMEN', 'semen'), ('TUMOR_MARKERS', 'tumor markers'), ('URINE', 'urine test')], max_length=100),
        ),
    ]
