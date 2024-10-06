from rest_framework.permissions import BasePermission


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        message = 'Only doctors have access to this page.'

        if request.user and request.user.role == 'DOCTOR':
            return True


class IsPatient(BasePermission):
    def has_permission(self, request, view):
        message = 'Only patients have access to this page.'

        if request.user and request.user.role == 'PATIENT':
            return True
