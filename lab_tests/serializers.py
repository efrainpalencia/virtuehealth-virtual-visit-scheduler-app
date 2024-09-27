from rest_framework import serializers
from .models import LabTest


class LabTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTest
        fields = ['id', 'patient', 'test_type', 'lab', 'lab_document']
