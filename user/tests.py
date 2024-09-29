from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Doctor, Patient
from doctor_dashboard.models import MedicalRecord

User = get_user_model()


class DoctorModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='doctoruser', password='testpass', email='doctoruser@example.com')
        self.doctor = Doctor.objects.create(
            user=self.user,
            specialty='Cardiology',
            phone_number='9541234567',
            fax_number='9541234567',
            languages='English, Spanish',
            insurance_provider='Health Insurance Inc.',
            schedule=[]
        )

    def test_doctor_creation(self):
        self.assertEqual(self.doctor.user.username, 'doctoruser')
        self.assertEqual(self.doctor.specialty, 'Cardiology')
        self.assertEqual(self.doctor.phone_number, '9541234567')
        self.assertEqual(self.doctor.fax_number, '9541234567')
        self.assertEqual(self.doctor.languages, 'English, Spanish')
        self.assertEqual(self.doctor.insurance_provider,
                         'Health Insurance Inc.')

    def test_doctor_str(self):
        self.assertEqual(str(self.doctor), 'doctoruser@example.com')


class PatientModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpass', email='testuser@example.com')
        self.patient = Patient.objects.create(
            user=self.user,
            date_of_birth='1990-01-01',
            ethnicity='Test Ethnicity',
            location='Test Location',
            address='Test Address',
            phone_number='9541234567'
        )
        self.medical_record = MedicalRecord.objects.create(
            patient=self.patient,
            height=175.5,
            weight=70.2,
            physical_activity='Moderate',
            psychological_assessment='Good',
            drugs_alcohol='None',
            medical_condition='Healthy',
            injury_illness='None',
            family_history='No significant history',
            treatment_surgery='None',
            current_medication='None',
            allergy='None',
            side_effects='None'
        )
        self.patient.medical_record = self.medical_record
        self.patient.save()

    def test_patient_creation(self):
        self.assertEqual(self.patient.user.username, 'testuser')
        self.assertEqual(self.patient.date_of_birth, '1990-01-01')
        self.assertEqual(self.patient.ethnicity, 'Test Ethnicity')
        self.assertEqual(self.patient.location, 'Test Location')
        self.assertEqual(self.patient.address, 'Test Address')
        self.assertEqual(self.patient.phone_number, '9541234567')
        self.assertEqual(self.patient.medical_record, self.medical_record)

    def test_patient_str(self):
        self.assertEqual(str(self.patient), 'testuser@example.com')
