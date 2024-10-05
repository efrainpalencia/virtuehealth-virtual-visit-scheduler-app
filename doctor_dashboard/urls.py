from django.urls import path
from doctor_dashboard.views import PatientViewSet, PatientList


urlpatterns = [
    path('get-patient/', PatientViewSet.as_view(), name='create'),
    path('patient-list/', PatientList.as_view(), name='list'),
]
