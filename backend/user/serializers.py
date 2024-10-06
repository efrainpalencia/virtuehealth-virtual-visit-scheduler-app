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
        fields = ['id', 'email',
                  'first_name', 'last_name', 'date_of_birth', 'role']


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['email',
                  'first_name', 'last_name', 'date_of_birth']


class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ['ethnicity',
                  'location', 'address', 'phone_number', 'medical_record']


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['email', 'first_name', 'last_name', 'date_of_birth']


class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = ['specialty', 'phone_number',
                  'fax_number', 'languages', 'insurance_provider', 'schedule']


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, write_only=True, max_length=128)
    password = serializers.CharField(
        max_length=128, min_length=8, write_only=True, required=True)
    date_of_birth = serializers.DateField(
        default=None)

    class Meta:
        model = User
        fields = ('email', 'password', 'date_of_birth')
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
    date_of_birth = serializers.DateField(
        default=None)

    class Meta:
        model = Doctor
        fields = ('email', 'password', 'date_of_birth')
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
    date_of_birth = serializers.DateField(
        default=None)

    class Meta:
        model = Patient
        fields = ('email', 'password', 'date_of_birth')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            user = Patient.patient.get(email=validated_data['email'])
            user.role = Patient.role
            user.save()
        except ObjectDoesNotExist:
            user = Patient.objects.create_user(**validated_data)
        return user


class LoginSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['user'] = UserSerializer(self.user).data
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        # data['role'] = self.user.role

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data
