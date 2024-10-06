from django.urls import path, include
from patient_portal.views import DoctorViewSet, PatientPortalView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'doctors_list', DoctorViewSet, basename='doctors-list')
router.register(r'patient_portal', PatientPortalView, basename='patient-home')


urlpatterns = [
    path('', include(router.urls)),
]
