from django.test import TestCase
from django.contrib.auth.models import User
from patient_portal.models import Patient
from lab_tests.models import LabTest


class LabTestModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='patientuser', password='testpass', email='patientuser@example.com')
        self.patient = Patient.objects.create(user=self.user)
        self.lab_test = LabTest.objects.create(
            patient=self.patient,
            test_type='Blood Test',
            lab='Health Lab',
            lab_document=b'This is a test document'
        )

    def test_lab_test_creation(self):
        self.assertEqual(self.lab_test.patient.user.username, 'patientuser')
        self.assertEqual(self.lab_test.test_type, 'Blood Test')
        self.assertEqual(self.lab_test.lab, 'Health Lab')
        self.assertEqual(self.lab_test.lab_document,
                         b'This is a test document')

    def test_lab_test_str(self):
        expected_str = f"Lab Test: {self.lab_test.test_type} for {
            self.lab_test.patient.user.email} at {self.lab_test.lab}"
        self.assertEqual(str(self.lab_test), expected_str)
