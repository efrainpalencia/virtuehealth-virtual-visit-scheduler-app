import os
from django_ratelimit.decorators import ratelimit
from django.shortcuts import redirect
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import RegisterSerializer, CustomLoginSerializer, CustomTokenObtainPairSerializer
from django.core.mail import send_mail
from dotenv import load_dotenv
load_dotenv()


class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    @action(detail=False, methods=['post'])
    @ratelimit(key='ip', rate='5/m', method='POST', block=True)
    def register(self, request):
        username = request.data.get('username')
        if not username.isalnum() and not all(char in '@./+/-/_' for char in username):
            return Response({"error": "Username can only contain letters, digits, and @/./+/-/_ characters"}, status=400)
        if len(username) > 150:
            return Response({"error": "Username must be 150 characters or fewer"}, status=400)

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)  # Print validation errors
            return Response(serializer.errors, status=400)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user_type = request.data.get('user_type')
        one_time_code = request.data.get('one_time_code')

        # Hardcoded one-time code for development
        valid_one_time_code = "1234567890"

        if user_type == 'doctor':
            if one_time_code != valid_one_time_code:
                user.delete()
                return Response({"error": "Invalid one-time code"}, status=400)
        return Response({"user": serializer.data})


class LoginViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        serializer = CustomLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_data = serializer.validated_data
        user = user_data['user']
        user_type = user_data['user_type']

        refresh = RefreshToken.for_user(user)
        response_data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_type': user_type
        }

        if user_type == 'doctor':
            return redirect('doctor_dashboard')
        elif user_type == 'patient':
            return redirect('patient_dashboard')

        return Response(response_data)


class PasswordResetViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def reset_password(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
        if user:
            # Send password reset email
            send_mail(
                'Password Reset Request',
                'Click the link below to reset your password:',
                {EMAIL_HOST_USER},
                [email],
                fail_silently=False,
            )
            return Response({"message": "Password reset email sent!"})
        return Response({"error": "User not found"}, status=404)


@ratelimit(key='ip', rate='5/m', method='POST', block=True)
class RefreshViewSet(TokenRefreshView):
    pass


class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=205)
        except Exception as e:
            return Response(status=400)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    serializer_class = CustomTokenObtainPairSerializer
