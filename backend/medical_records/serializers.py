from rest_framework import serializers
from .models import MedicalRecord


class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = ['id', 'patient', 'height', 'weight', 'physical_activity', 'psychological_assessment', 'drugs_alcohol',
                  'medical_condition', 'injury_illness', 'family_history', 'treatment_surgery', 'current_medication', 'allergy', 'side_effects']
