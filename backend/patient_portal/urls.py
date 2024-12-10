from django.urls import path, include
from patient_portal.views import DoctorList
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'doctor-list', DoctorList.as_view(),
                basename='doctor-list')

urlpatterns = [
    path('', include(router.urls)),
]
