from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from django.core.exceptions import ObjectDoesNotExist

from .models import User
from .models import Doctor, Patient, DoctorProfile, PatientProfile


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = fields = '__all__'


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'


class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = '__all__'


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = fields = '__all__'


class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = fields = '__all__'

    def validate_schedule(self, value):
        # If the schedule is null or empty, allow it (optional based on requirements)
        if value is None or not value:
            return []
        return value


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, write_only=True, max_length=128)
    password = serializers.CharField(
        max_length=128, min_length=8, write_only=True, required=True)
    date_of_birth = serializers.DateField(
        default=None)

    class Meta:
        model = User
        fields = ('email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            user = User.objects.get(email=validated_data['email'])
            user.role = User.role
            user.save()
        except ObjectDoesNotExist:
            user = User.objects.create_user(**validated_data)
        return user


class DoctorRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, write_only=True, max_length=128)
    password = serializers.CharField(
        max_length=128, min_length=8, write_only=True, required=True)

    class Meta:
        model = Doctor
        fields = ('email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            user = Doctor.doctor.get(email=validated_data['email'])
            user.role = Doctor.role
            user.save()
        except ObjectDoesNotExist:
            user = Doctor.objects.create_user(**validated_data)
        return user


class PatientRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, write_only=True, max_length=128)
    password = serializers.CharField(
        max_length=128, min_length=8, write_only=True, required=True)

    class Meta:
        model = Patient
        fields = ('email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            user = Patient.patient.get(email=validated_data['email'])
            user.role = Patient.role
            user.save()
        except ObjectDoesNotExist:
            user = Patient.objects.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['id'] = user.id

        access_token = token.access_token
        refresh_token = token

        # Log the token for debugging
        print(f"Generated Token for User ID: {user.id}, Role: {user.role}")
        print(f"Token Payload: {access_token}")
        print(f"Generated Refresh Token: {refresh_token}")

        return token


class LoginSerializer(CustomTokenObtainPairSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['user'] = UserSerializer(self.user).data
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['role'] = self.user.role

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data
