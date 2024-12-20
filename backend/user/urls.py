from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorRegisterViewSet, LoginViewSet, RefreshViewSet, PatientViewSet, PatientProfileViewSet, PatientRegisterViewSet, DoctorViewSet, DoctorProfileViewSet, PasswordResetViewSet, PasswordResetConfirmViewSet


router = DefaultRouter()
router.register(r'register-doctor', DoctorRegisterViewSet,
                basename='register-doctor'),
router.register(r'register-patient', PatientRegisterViewSet,
                basename='register-patient'),
router.register(r'doctor', DoctorViewSet, basename='doctor'),
router.register(r'patient', PatientViewSet, basename='patient'),
router.register(r'patient-profiles', PatientProfileViewSet,
                basename='patient-profile')
router.register(r'doctor-profiles', DoctorProfileViewSet,
                basename='doctor-profile')


urlpatterns = [
    path('', include(router.urls)),
    path(
        'login/', LoginViewSet.as_view({'post': 'login'}), name='custom-login'),
    path('refresh/',
         RefreshViewSet.as_view({'post': 'refresh'}), name='refresh'),
    path('reset_password', PasswordResetViewSet.as_view(
        {'post': 'reset_password'}), name='reset-password'),
    path('reset_password_confirm', PasswordResetConfirmViewSet.as_view(
        {'post': 'reset_password_confirm'}), name='reset-password-confirm'),
]
