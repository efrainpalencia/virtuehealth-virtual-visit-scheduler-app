from VirtueHealthCore.validators import validate_email
from .serializers import DoctorRegisterSerializer, RegisterSerializer, LoginSerializer
from .models import User, Doctor
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets, permissions
import os
from django.shortcuts import redirect
from django.core.mail import send_mail
from dotenv import load_dotenv
load_dotenv()


class DoctorRegisterViewSet(viewsets.ModelViewSet, TokenObtainPairView):
    queryset = Doctor.doctor.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = DoctorRegisterSerializer

    @action(detail=False, methods=['post'])
    def register(self, request, *args, **kwargs):
        email = request.data.get('email')

        if not validate_email(email):
            return Response({"error": "Email can only contain letters, digits, and @/./+/-/_ characters"}, status=400)
        if len(email) > 150:
            return Response({"error": "Email must be 150 characters or fewer"}, status=400)

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)  # Print validation errors
            return Response(serializer.errors, status=400)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        return Response({"user": serializer.data, "refresh": res["refresh"], "token": res["access"]}, status=status.HTTP_201_CREATED)


class LoginViewSet(viewsets.ModelViewSet, TokenObtainPairView):

    @ action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        user = serializer.validated_data['user']
        role = user.role

        if role == 'doctor':
            return redirect('doctor_dashboard')
        elif role == 'patient':
            return redirect('patient_dashboard')

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class PasswordResetViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @ action(detail=False, methods=['post'])
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


class RefreshViewSet(viewsets.ViewSet, TokenRefreshView):
    permission_classes = [permissions.AllowAny]

    @ action(detail=False, methods=['post'])
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


# class AuthViewSet(viewsets.ViewSet):
#     permission_classes = [permissions.IsAuthenticated]

#     @ action(detail=False, methods=['post'])
#     def logout(self, request):
#         try:
#             refresh_token = request.data["refresh_token"]
#             token = RefreshToken(refresh_token)
#             token.blacklist()
#             return Response(status=205)
#         except Exception as e:
#             return Response(status=400)
