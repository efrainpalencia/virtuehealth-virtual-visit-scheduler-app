from django.urls import path
from patient_portal.views import DoctorViewSet


urlpatterns = [
    path('', DoctorViewSet.as_view(), name='doctor-list'),
]
