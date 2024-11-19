from django.contrib import admin
from medical_records.models import MedicalRecord


# @admin.register(MedicalRecord)
# class MedicalRecordAdmin(admin.ModelAdmin):
#     list_display = ('id', 'patient',)

admin.site.register(MedicalRecord)
