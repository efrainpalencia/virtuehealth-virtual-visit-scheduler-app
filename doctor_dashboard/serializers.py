from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Doctor, MedicalRecord


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Doctor
        fields = ['id', 'user', 'specialty', 'phone_number',
                  'fax_number', 'languages', 'insurance_provider', 'schedule']


class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = ['id', 'patient', 'height', 'weight', 'physical_activity', 'psychological_assessment', 'drugs_alcohol',
                  'medical_condition', 'injury_illness', 'family_history', 'treatment_surgery', 'current_medication', 'allergy', 'side_effects']
