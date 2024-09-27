from django.urls import path
from .views import LabTestViewSet


urlpatterns = [
    path('', LabTestViewSet.as_view(), name='labtest-list'),
]
