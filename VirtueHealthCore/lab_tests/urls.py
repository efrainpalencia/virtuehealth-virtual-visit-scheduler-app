from django.urls import path
from . import views

urlpatterns = [
    path('lab-tests/', views.LabTestListView.as_view(), name='labtest-list'),
    path('lab-tests/<int:pk>/', views.LabTestDetailView.as_view(),
         name='labtest-detail'),
]
