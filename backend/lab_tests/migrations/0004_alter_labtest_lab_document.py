# Generated by Django 5.1.1 on 2024-10-06 22:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lab_tests', '0003_alter_labtest_lab_document'),
    ]

    operations = [
        migrations.AlterField(
            model_name='labtest',
            name='lab_document',
            field=models.FileField(upload_to='lab_documents/'),
        ),
    ]