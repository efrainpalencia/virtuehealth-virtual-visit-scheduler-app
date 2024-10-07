from django.urls import include, path
from doctor_dashboard.views import PatientList
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'patient-list', PatientList.as_view(),
                basename='doctor-dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
