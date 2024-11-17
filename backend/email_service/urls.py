from django.urls import path
from .views import AppointmentEmailView

urlpatterns = [
    path("send-appointment/", AppointmentEmailView.as_view(),
         name="send-appointment-email"),
]
