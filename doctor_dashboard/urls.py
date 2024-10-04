from django.urls import path
from doctor_dashboard.views import PatientViewSet


urlpatterns = [
    path('list/', PatientViewSet.as_view(), name='patient-list'),
]
