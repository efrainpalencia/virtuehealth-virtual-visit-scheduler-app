from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from user.models import User  # Import the User model


class UserAuthenticationTestCase(TestCase):
    def setUp(self):
        """Set up test data for each test."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="testuser@example.com",
            password="password123",
            role=User.Role.PATIENT,  # Default role for testing
        )

    def test_user_login_success(self):
        """Test successful login for a user with correct credentials."""
        response = self.client.post('/api/auth/login/', {
            'email': 'testuser@example.com',
            'password': 'password123',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_user_login_failure_nonexistent_email(self):
        """Test login failure when email does not exist."""
        response = self.client.post('/api/auth/login/', {
            'email': 'nonexistent@example.com',
            'password': 'password123',
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('non_field_errors', response.data)
        self.assertEqual(
            response.data['non_field_errors'][0],
            "User with this email does not exist."
        )

    def test_user_login_failure_invalid_password(self):
        """Test login failure due to an incorrect password."""
        response = self.client.post('/api/auth/login/', {
            'email': 'testuser@example.com',
            'password': 'wrongpassword',
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('non_field_errors', response.data)
        self.assertEqual(
            response.data['non_field_errors'][0],
            "Invalid password."
        )
