from user.serializers import DoctorSerializer, DoctorProfileSerializer
from user.models import Doctor, DoctorProfile
from rest_framework import viewsets, status, permissions
from datetime import datetime, timezone
from django.utils.timezone import now
# from django.utils import timezone
from VirtueHealthCore.settings import FRONTEND_URL, EMAIL_HOST_USER
import logging
from VirtueHealthCore.validators import validate_email
from user.serializers import DoctorRegisterSerializer, PatientRegisterSerializer, LoginSerializer, DoctorSerializer, PatientProfile, PatientProfileSerializer, PatientSerializer, DoctorProfileSerializer
from .models import DoctorProfile, User, Doctor, Patient
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken, AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
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

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except AuthenticationFailed as e:
            # Handle incorrect email/password
            error_message = str(e.detail) if isinstance(
                e.detail, str) else e.detail.get('detail', 'Authentication failed.')
            return Response(
                {"non_field_errors": [error_message]},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except TokenError as e:
            # Handle token generation issues
            return Response(
                {"non_field_errors": ["Token generation failed."]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            # Handle unexpected errors
            return Response(
                {"non_field_errors": ["An unexpected error occurred."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

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
    permission_classes = [permissions.IsAuthenticated]


class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.doctor.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]


class DoctorProfileViewSet(viewsets.ModelViewSet):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    logger = logging.getLogger(__name__)

    def perform_create(self, serializer):
        # Automatically set an empty list if schedule is not provided
        serializer.save(schedule=serializer.validated_data.get("schedule", []))

    def perform_update(self, serializer):
        # Allow updates with no changes to schedule
        serializer.save(schedule=serializer.validated_data.get(
            "schedule", self.get_object().schedule))

    # def create(self, request, *args, **kwargs):
    #     # Ensure no duplicate profiles are created
    #     user_id = request.data.get("user_id")
    #     if DoctorProfile.objects.filter(user_id=user_id).exists():
    #         return Response(
    #             {"error": "Profile already exists. Use PATCH to update."},
    #             status=status.HTTP_400_BAD_REQUEST,
    #         )
    #     return super().create(request, *args, **kwargs)

    @action(detail=True, methods=["get"], url_path="booked-slots")
    def booked_slots(self, request, pk=None):
        """
        Fetch all booked slots for a doctor's schedule.
        """
        doctor_profile = self.get_object()
        return Response(doctor_profile.schedule, status=status.HTTP_200_OK)

    @action(detail=True, methods=["patch"], url_path="remove-schedule-date")
    def remove_schedule_date(self, request, pk=None):
        """
        Remove a specific date from the doctor's schedule.
        """
        doctor_profile = self.get_object()
        date_to_remove = request.data.get("date")

        if not date_to_remove:
            return Response(
                {"error": "Date to remove not provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            date_to_remove_obj = self._convert_to_datetime(date_to_remove)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        updated_schedule = [
            date
            for date in doctor_profile.schedule
            if self._convert_to_datetime(date) != date_to_remove_obj
        ]

        if len(updated_schedule) == len(doctor_profile.schedule):
            return Response(
                {"error": "Date not found in schedule."},
                status=status.HTTP_404_NOT_FOUND,
            )

        doctor_profile.schedule = updated_schedule
        doctor_profile.save()

        return Response(
            {"message": "Date removed from schedule successfully."},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["patch"], url_path="add-schedule-date")
    def add_schedule_date(self, request, pk=None):
        """
        Add a specific date to the doctor's schedule.
        """
        doctor_profile = self.get_object()
        date_to_add = request.data.get("date")

        if not date_to_add:
            return Response(
                {"error": "Date to add not provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            date_to_add_obj = self._convert_to_datetime(date_to_add)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        if not self._is_valid_time_slot(date_to_add_obj):
            return Response(
                {"error": "Time slot must be within working hours (9:00 AM to 5:00 PM)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if date_to_add_obj < now():
            return Response(
                {"error": "Cannot add a time slot in the past."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Avoid duplicates in schedule
        if any(
            self._convert_to_datetime(date) == date_to_add_obj
            for date in doctor_profile.schedule
        ):
            return Response(
                {"error": "Date already in schedule."}, status=status.HTTP_400_BAD_REQUEST
            )

        doctor_profile.schedule.append(date_to_add_obj)
        doctor_profile.save()

        return Response(
            {"message": "Date added to schedule successfully."},
            status=status.HTTP_200_OK,
        )

    def _convert_to_datetime(self, date_input):
        """
        Helper method to convert ISO string or datetime object to timezone-aware UTC datetime.
        """
        if isinstance(date_input, datetime):
            # Return as-is if already timezone-aware
            if date_input.tzinfo:
                return date_input.astimezone(timezone.utc)
            # Make naive datetime timezone-aware
            return datetime.fromisoformat(date_input.isoformat()).replace(tzinfo=timezone.utc)
        elif isinstance(date_input, str):
            try:
                # Handle ISO-8601 strings with or without 'Z'
                return datetime.fromisoformat(date_input.replace("Z", "+00:00")).astimezone(
                    timezone.utc
                )
            except ValueError as e:
                raise ValueError(f"Invalid date string format. Error: {e}")
        else:
            raise TypeError(
                f"Expected a string in ISO-8601 format or a datetime object, got {
                    type(date_input)} instead."
            )

    def _is_valid_time_slot(self, date_obj):
        """
        Helper method to validate if a time slot is within working hours.
        """
        return 9 <= date_obj.hour < 17
