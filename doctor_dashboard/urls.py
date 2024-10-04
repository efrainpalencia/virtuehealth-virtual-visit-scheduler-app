from django.urls import path
from medical_records.views import MedicalRecordViewSet
from patient_portal.views import DoctorViewSet

urlpatterns = [
    path('', DoctorViewSet.as_view(), name='doctor-list'),
    path('patient-records/', MedicalRecordViewSet.as_view(),
         name='medical-record-list'),
]
