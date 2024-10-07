"""
URL configuration for VirtueHealthCore project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from rest_framework.routers import DefaultRouter

from medical_records.views import MedicalRecordViewSet
from appointments.views import AppointmentViewset
from lab_tests.views import LabTestViewSet
from patient_portal.views import DoctorList
from user.views import DoctorProfileViewSet, PatientProfileViewSet


router = DefaultRouter()
router.register(r'appointments', AppointmentViewset, basename='appointment')
router.register(r'lab_tests', LabTestViewSet, basename='lab-test')
# doctor_dashboard
router.register(r'doctor-dashboard', DoctorProfileViewSet,
                basename='doctor-dashboard')
# patient_portal
router.register(r'patient-portal', PatientProfileViewSet,
                basename='patient-portal')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls,)),
    path('api/auth/', include('user.urls')),
    # path('api/doctor-dashboard/', include('doctor_dashboard.urls')),
    # path('api/patient-portal/', include('patient_portal.urls')),
]
