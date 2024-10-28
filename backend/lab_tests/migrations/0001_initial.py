# Generated by Django 5.1.1 on 2024-10-28 15:02

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LabTest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('test_type', models.CharField(choices=[('BLOOD', 'blood test'), ('FECAL', 'fecal'), ('SEMEN', 'semen'), ('TUMOR_MARKERS', 'tumor markers'), ('URINE', 'urine test')], max_length=100, null=True)),
                ('lab', models.CharField(max_length=100)),
                ('lab_document', models.FileField(upload_to='lab_documents/')),
            ],
        ),
    ]
