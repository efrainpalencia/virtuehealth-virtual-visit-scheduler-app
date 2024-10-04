from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from user.models import User, Patient, Doctor


class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = (
        "email",
        "first_name",
        "last_name",
        "date_of_birth",
        "role",
        "is_active",
    )
    list_filter = (
        "email",
        "first_name",
        "last_name",
        "date_of_birth",
        "is_staff",
        "is_active",
    )
    fieldsets = (
        (None, {"fields": (
            "first_name",
            "last_name",
            "email",
            "password",
            "date_of_birth")}
         ),
        ("Permissions", {"fields": (
            "is_staff",
            "is_active",
            "groups",
            "user_permissions")}
         ),
    )
    add_fieldsets = (
        (None, {"fields": (
            "first_name",
            "last_name",
            "email",
            "password1",
            "password2",
            "date_of_birth",
            "role",
            "is_staff",
            "is_active",
            "groups",
            "user_permissions")}
         ),
    )
    search_fields = ("email",)
    ordering = ("email",)


class CustomDoctorAdmin(BaseUserAdmin):
    model = Doctor
    list_display = (
        "email",
        "first_name",
        "last_name",
        "date_of_birth",
        "role",
        "is_active",
    )
    list_filter = (
        "email",
        "first_name",
        "last_name",
        "date_of_birth",
        "is_staff",
        "is_active",
    )
    fieldsets = (
        (None, {"fields": (
            "first_name",
            "last_name",
            "email",
            "password",
            "date_of_birth")}
         ),
        ("Permissions", {"fields": (
            "is_staff",
            "is_active",
            "groups",
            "user_permissions")}
         ),
    )
    add_fieldsets = (
        (None, {"fields": (
            "first_name",
            "last_name",
            "email",
            "password1",
            "password2",
            "date_of_birth",
            "role",
            "is_staff",
            "is_active",
            "groups",
            "user_permissions")}
         ),
    )
    search_fields = ("email",)
    ordering = ("email",)


class CustomPatientAdmin(BaseUserAdmin):
    model = Patient
    list_display = (
        "email",
        "first_name",
        "last_name",
        "date_of_birth",
        "role",
        "is_active",
    )
    list_filter = (
        "email",
        "first_name",
        "last_name",
        "date_of_birth",
        "is_staff",
        "is_active",
    )
    fieldsets = (
        (None, {"fields": (
            "first_name",
            "last_name",
            "email",
            "password",
            "date_of_birth",
            "role")}
         ),
        ("Permissions", {"fields": (
            "is_staff",
            "is_active",
            "groups",
            "user_permissions",)}
         ),
    )
    add_fieldsets = (
        (None, {"fields": (
            "first_name",
            "last_name",
            "email",
            "password1",
            "password2",
            "date_of_birth",
            "role",
            "is_staff",
            "is_active",
            "groups",
            "user_permissions",)}
         ),
    )
    search_fields = ("email",)
    ordering = ("email",)


admin.site.register(User, CustomUserAdmin)
admin.site.register(Patient, CustomPatientAdmin)
admin.site.register(Doctor, CustomDoctorAdmin)
