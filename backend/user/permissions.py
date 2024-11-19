from rest_framework.permissions import BasePermission


class IsDoctor(BasePermission):
    """
    Custom permission to grant access only to doctors.
    """
    message = "Only doctors have access to this page."

    def has_permission(self, request, view):
        return hasattr(request.user, 'role') and request.user.role == "DOCTOR"


class IsPatient(BasePermission):
    """
    Custom permission to grant access only to patients.
    """
    message = "Only patients have access to this page."

    def has_permission(self, request, view):
        return hasattr(request.user, 'role') and request.user.role == "PATIENT"


class IsAdmin(BasePermission):
    """
    Custom permission to grant access only to admins.
    """
    message = "Only administrators are allowed to access this resource."

    def has_permission(self, request, view):
        return hasattr(request.user, 'role') and request.user.role == "ADMIN"
