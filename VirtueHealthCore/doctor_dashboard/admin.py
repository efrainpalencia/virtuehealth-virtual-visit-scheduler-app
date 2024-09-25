from django.contrib import admin
from .models import Doctor, MedicalRecord

admin.site.register(Doctor)
admin.site.register(MedicalRecord)
