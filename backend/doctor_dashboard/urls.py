from django.urls import include, path
from doctor_dashboard.views import PatientViewSet, DoctorDashboardView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'doctor_dashboard', DoctorDashboardView,
                basename='doctor-home')


urlpatterns = [
    path('', include(router.urls)),
]
