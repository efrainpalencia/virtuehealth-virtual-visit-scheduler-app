# custom_auth/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterViewSet, LoginViewSet, RefreshViewSet, AuthViewSet

router = DefaultRouter()
router.register(r'register', RegisterViewSet, basename='register')
router.register(r'logout', AuthViewSet, basename='logout')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginViewSet.as_view(), name='token_obtain_pair'),
    path('refresh/', RefreshViewSet.as_view(), name='token_refresh'),
]
