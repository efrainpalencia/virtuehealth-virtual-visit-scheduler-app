from django.urls import path
from .views import create_room, notify_patient, proxy_create_room

urlpatterns = [
    path("create-room/", create_room, name="create-room"),
    path("proxy-create-room/", proxy_create_room, name="proxy-create-room"),
    path("notify-patient/", notify_patient, name="notify-patient"),
]
