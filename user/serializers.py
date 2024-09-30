from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from .models import Doctor, Patient

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    user_type = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'user_type')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            user_type=validated_data['user_type']
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email',
                  'first_name', 'last_name', 'user_type']


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

    def create(self, validated_data):
        user = validated_data['user']
        return {
            'user': user,
            'user_type': user.user_type
        }

    class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
        @classmethod
        def get_token(cls, user):
            token = super().get_token(user)
            # Add custom claims
            token['user_type'] = user.user_type
            return token
