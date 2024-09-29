from django.test import TestCase
from django.contrib.auth import get_user_model
from doctor_dashboard.models import Doctor, MedicalRecord
from patient_portal.models import Patient

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


class MedicalRecordModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='patientuser', password='testpass', email='patientuser@example.com')
        self.patient = Patient.objects.create(user=self.user)
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

    def test_medical_record_creation(self):
        self.assertEqual(
            self.medical_record.patient.user.username, 'patientuser')
        self.assertEqual(self.medical_record.height, 175.5)
        self.assertEqual(self.medical_record.weight, 70.2)
        self.assertEqual(self.medical_record.physical_activity, 'Moderate')
        self.assertEqual(self.medical_record.psychological_assessment, 'Good')
        self.assertEqual(self.medical_record.drugs_alcohol, 'None')
        self.assertEqual(self.medical_record.medical_condition, 'Healthy')
        self.assertEqual(self.medical_record.injury_illness, 'None')
        self.assertEqual(self.medical_record.family_history,
                         'No significant history')
        self.assertEqual(self.medical_record.treatment_surgery, 'None')
        self.assertEqual(self.medical_record.current_medication, 'None')
        self.assertEqual(self.medical_record.allergy, 'None')
        self.assertEqual(self.medical_record.side_effects, 'None')

    def test_medical_record_str(self):
        self.assertEqual(str(self.medical_record),
                         'Medical Record for patientuser@example.com')
