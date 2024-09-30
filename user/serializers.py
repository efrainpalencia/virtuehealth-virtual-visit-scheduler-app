from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from .models import Doctor, Patient

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    user_type = serializers.CharField(write_only=True)
    one_time_code = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('username', 'password', 'email',
                  'user_type', 'one_time_code')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Patient
        fields = ['id', 'user', 'date_of_birth', 'ethnicity',
                  'location', 'address', 'phone_number', 'medical_record']


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Doctor
        fields = ['id', 'user', 'specialty', 'phone_number',
                  'fax_number', 'languages', 'insurance_provider', 'schedule']


class CustomLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user and user.is_active:
            data['user'] = user
        else:
            raise serializers.ValidationError("Invalid credentials")
        return data

    def get_user_type(self, user):
        if user.groups.filter(name='Doctors').exists():
            return 'doctor'
        elif user.groups.filter(name='Patients').exists():
            return 'patient'
        return 'unknown'

    class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

        @classmethod
        def get_token(cls, user):
            token = super().get_token(user)
            # Add custom claims
            token['user_type'] = [group.name for group in user.groups.all()]
            return token
