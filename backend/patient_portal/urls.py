from django.urls import path, include
from patient_portal.views import DoctorViewSet, PatientPortalView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'patient_portal', PatientPortalView, basename='patient')


urlpatterns = [
    path('', include(router.urls)),
]
