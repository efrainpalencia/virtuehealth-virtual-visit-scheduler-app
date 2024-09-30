from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterViewSet, LoginViewSet, RefreshViewSet, AuthViewSet

router = DefaultRouter()
router.register(r'register', RegisterViewSet, basename='register')
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
    path('api/login/',
         LoginViewSet.as_view({'post': 'login'}), name='custom_login'),
    path('refresh/', RefreshViewSet.as_view(), name='refresh'),
]
