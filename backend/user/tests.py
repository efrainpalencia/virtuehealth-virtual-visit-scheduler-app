from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from user.models import User  # Import only the User model


class UserAuthenticationTestCase(TestCase):
    def setUp(self):
        """Set up test data for each test."""
        self.client = APIClient()
        # Create a user
        self.user = User.objects.create_user(
            email="testuser@example.com",
            password="password123",
            role=User.Role.PATIENT  # Adjust the role if necessary
        )

    def tearDown(self):
        """Clean up the database after each test."""
        User.objects.all().delete()

    def test_user_login_success(self):
        """Test successful login for a user."""
        response = self.client.post('/api/auth/login/', {
            'email': 'testuser@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_user_login_failure_invalid_password(self):
        """Test login failure due to an invalid password."""
        response = self.client.post('/api/auth/login/', {
            'email': 'testuser@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    def test_user_login_failure_nonexistent_user(self):
        """Test login failure for a non-existent user."""
        response = self.client.post('/api/auth/login/', {
            'email': 'nonexistent@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)
