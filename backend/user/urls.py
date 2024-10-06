from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorRegisterViewSet, LoginViewSet, RefreshViewSet


router = DefaultRouter()
router.register(r'register', DoctorRegisterViewSet, basename='register'),

urlpatterns = [
    path('', include(router.urls)),
    path(
        'login/', LoginViewSet.as_view({'post': 'login'}), name='custom_login'),
    path('refresh/',
         RefreshViewSet.as_view({'post': 'refresh'}), name='refresh'),
]
