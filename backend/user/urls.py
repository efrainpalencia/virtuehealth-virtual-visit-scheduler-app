from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorRegisterViewSet, LoginViewSet, RefreshViewSet, PatientViewSet, PatientProfileViewSet, DoctorViewSet, DoctorProfileViewSet


router = DefaultRouter()
router.register(r'register', DoctorRegisterViewSet, basename='register'),
router.register(r'doctor', DoctorViewSet, basename='doctor'),
router.register(r'patient', PatientViewSet, basename='patient'),
router.register(r'patient-profiles', PatientProfileViewSet,
                basename='patient-profile')
router.register(r'doctor-profiles', DoctorProfileViewSet,
                basename='doctor-profile')


urlpatterns = [
    path('', include(router.urls)),
    path(
        'login/', LoginViewSet.as_view({'post': 'login'}), name='custom_login'),
    path('refresh/',
         RefreshViewSet.as_view({'post': 'refresh'}), name='refresh'),
]
