from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models


class User(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_groups',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if hasattr(self, 'doctor'):
            group, created = Group.objects.get_or_create(name='Doctors')
            self.groups.add(group)
        elif hasattr(self, 'patient'):
            group, created = Group.objects.get_or_create(name='Patients')
            self.groups.add(group)
