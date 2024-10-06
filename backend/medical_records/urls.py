from django.urls import path
from medical_records.views import MedicalRecordViewSet

urlpatterns = [
    path('patient-records/', MedicalRecordViewSet.as_view(),
         name='medical-record-list'),
]
