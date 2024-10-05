from django.urls import include, path
from doctor_dashboard.views import PatientViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'patient-list', PatientViewSet, basename='patient-list')


urlpatterns = [
    path('', include(router.urls)),
]
