from datetime import datetime, timezone
from datetime import datetime
from VirtueHealthCore.settings import FRONTEND_URL, EMAIL_HOST_USER
import logging
import os
from venv import logger
from VirtueHealthCore.validators import validate_email
from VirtueHealthCore import settings
from medical_records.models import MedicalRecord
from medical_records.serializers import MedicalRecordSerializer
from user.serializers import DoctorRegisterSerializer, PatientRegisterSerializer, LoginSerializer, DoctorSerializer, PatientProfile, PatientProfileSerializer, PatientSerializer, DoctorProfileSerializer
from .models import DoctorProfile, User, Doctor, Patient
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets, permissions, authentication
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.urls import reverse
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
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        return Response({"user": serializer.data, "refresh": res["refresh"], "token": res["access"]}, status=status.HTTP_201_CREATED)


class PatientRegisterViewSet(viewsets.ModelViewSet, TokenObtainPairView):
    queryset = Patient.patient.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = PatientRegisterSerializer

    @action(detail=False, methods=['post'])
    def register(self, request, *args, **kwargs):
        email = request.data.get('email')

        if not validate_email(email):
            return Response({"error": "Email can only contain letters, digits, and @/./+/-/_ characters"}, status=400)
        if len(email) > 150:
            return Response({"error": "Email must be 150 characters or fewer"}, status=400)

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)  # Log validation errors
            return Response(serializer.errors, status=400)

        user = serializer.save()  # Save only once
        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        return Response({"user": serializer.data, "refresh": res["refresh"], "token": res["access"]}, status=status.HTTP_201_CREATED)


class LoginViewSet(viewsets.ModelViewSet, TokenObtainPairView):
    serializer_class = LoginSerializer

    @ action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


logger = logging.getLogger(__name__)


class PasswordResetViewSet(viewsets.ViewSet):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def reset_password(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = PasswordResetTokenGenerator().make_token(user)
            reset_url = f"{
                FRONTEND_URL}/reset_password?uid={uid}&token={token}"
            send_mail(
                "Password Reset Request",
                f"Click the link below to reset your password:\n{reset_url}",
                EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            return Response({"message": "Password reset email sent!"})
        return Response({"error": "User not found"}, status=404)


class PasswordResetConfirmViewSet(viewsets.ViewSet):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def reset_password_confirm(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
            if PasswordResetTokenGenerator().check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password updated successfully!"})
            return Response({"error": "Invalid token"}, status=400)
        except Exception:
            return Response({"error": "Invalid token or user"}, status=400)


class RefreshViewSet(viewsets.ViewSet, TokenRefreshView):
    permission_classes = [permissions.AllowAny]

    @ action(detail=True, methods=['post'])
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.patient.all()
    serializer_class = PatientSerializer
    authentication_classes = [
        authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]


class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    authentication_classes = [
        authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.doctor.all()
    serializer_class = DoctorSerializer
    authentication_classes = [
        authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]


class DoctorProfileViewSet(viewsets.ModelViewSet):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    authentication_classes = [
        authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]


# Custom action to remove a specific date from the doctor's schedule
    logger = logging.getLogger(__name__)

    @action(detail=True, methods=['patch'], url_path='remove-schedule-date')
    def remove_schedule_date(self, request, pk=None):
        doctor_profile = self.get_object()
        date_to_remove = request.data.get('date')

        if not date_to_remove:
            return Response(
                {"error": "Date to remove not provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Convert date_to_remove to a timezone-aware datetime object in UTC
        try:
            date_to_remove_obj = datetime.fromisoformat(
                date_to_remove.replace("Z", "+00:00")).astimezone(timezone.utc)
        except ValueError:
            return Response(
                {"error": "Invalid date format. Please provide an ISO format date string."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prepare an updated schedule without the matching date
        updated_schedule = []
        for date in doctor_profile.schedule:
            # Ensure the date is converted to a datetime object if it's a string
            if isinstance(date, str):
                try:
                    date_obj = datetime.fromisoformat(
                        date.replace("Z", "+00:00")).astimezone(timezone.utc)
                except ValueError:
                    continue
            else:
                date_obj = date

            # Append only non-matching dates to the updated schedule
            if date_obj != date_to_remove_obj:
                updated_schedule.append(date)

        # Check if any dates were removed
        if len(updated_schedule) == len(doctor_profile.schedule):
            return Response(
                {"error": "Date not found in schedule."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update and save the modified schedule
        doctor_profile.schedule = updated_schedule
        doctor_profile.save()

        return Response(
            {"message": "Date removed from schedule successfully."},
            status=status.HTTP_200_OK
        )

    # Custom action to add a specific date from the doctor's schedule

    @action(detail=True, methods=['patch'], url_path='add-schedule-date')
    def add_schedule_date(self, request, pk=None):
        doctor_profile = self.get_object()
        date_to_add = request.data.get('date')

        if not date_to_add:
            return Response({"error": "Date to add not provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            date_to_add_obj = datetime.fromisoformat(
                date_to_add.replace("Z", "+00:00")).astimezone(timezone.utc)
        except ValueError:
            return Response({"error": "Invalid date format."}, status=status.HTTP_400_BAD_REQUEST)

        if date_to_add not in doctor_profile.schedule:
            doctor_profile.schedule.append(date_to_add)
            doctor_profile.save()

            return Response({"message": "Date added to schedule successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Date already in schedule."}, status=status.HTTP_400_BAD_REQUEST)
