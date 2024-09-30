from rest_framework.permissions import BasePermission


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.user_type == 'doctor'


class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.user_type == 'patient'
