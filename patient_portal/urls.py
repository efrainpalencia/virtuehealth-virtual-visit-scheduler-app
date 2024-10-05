from django.urls import path, include
from patient_portal.views import DoctorViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'doctor-list', DoctorViewSet, basename='doctor-list'),

urlpatterns = [
    path('', include(router.urls)),
]
