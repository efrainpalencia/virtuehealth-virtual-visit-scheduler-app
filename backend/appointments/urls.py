from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewset

router = DefaultRouter()
router.register(r'appointments', AppointmentViewset, basename='appointment')

urlpatterns = [
    path('', include(router.urls)),
]
