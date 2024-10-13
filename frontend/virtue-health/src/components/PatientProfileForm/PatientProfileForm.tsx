import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, message, Spin, Select } from "antd";
import {
  getPatient,
  getPatientProfile,
  createPatientProfile,
  updatePatientProfile,
  updatePatient,
} from "../../services/patientService"; // Adjust path
import { Patient, PatientProfile } from "../../services/patientService"; // Adjust path
import { getIdFromToken } from "../../services/authService";

const { TextArea } = Input;
const { Option } = Select;

const raceEthnicityOptions = [
  { value: "WHITE", label: "White (not of Hispanic origin)" },
  { value: "BLACK", label: "Black (not of Hispanic origin)" },
  { value: "HISPANIC_LATINO", label: "Hispanic or Latino" },
  { value: "ASIAN", label: "Asian" },
  {
    value: "AMERICAN_INDIAN_NATIVE_ALASKAN",
    label: "American Indian or Alaska Native",
  },
  {
    value: "NATIVE_HAWAIIAN_PACIFIC_ISLANDER",
    label: "Native Hawaiian or Pacific Islander",
  },
];

const getLoggedInPatientId = (): number | null => {
  const token = localStorage.getItem("access_token");
  if (token) {
    try {
      return getIdFromToken(token);
    } catch (error) {
      console.error("Failed to decode token", error);
      return null;
    }
  }
  return null;
};

const PatientProfileForm: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [form] = Form.useForm();

  // Get logged-in patient's ID
  const patientId = getLoggedInPatientId();
  console.log(patientId);

  useEffect(() => {
    if (!patientId) {
      message.error("No patient ID found.");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedPatient = await getPatient(patientId);
        setPatient(fetchedPatient);

        const fetchedProfile = await getPatientProfile(patientId);
        setProfile(fetchedProfile);

        if (fetchedPatient) {
          form.setFieldsValue({
            first_name: fetchedPatient.first_name,
            last_name: fetchedPatient.last_name,
            email: fetchedPatient.email,
            date_of_birth: fetchedPatient.date_of_birth,
            race_ethnicity: fetchedProfile?.race_ethnicity || undefined,
            address: fetchedProfile?.address || undefined,
            phone_number: fetchedProfile?.phone_number || undefined,
            insurance_provider: fetchedProfile?.insurance_provider || undefined,
          });
        }
      } catch (error) {
        message.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId, form]);

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // Update Patient data
      const patientData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        date_of_birth: values.date_of_birth,
      };

      console.log("Patient Data being sent:", patientData);
      await updatePatient(patientId, patientData);

      // Update PatientProfile data
      const profileData = {
        race_ethnicity: values.race_ethnicity,
        address: values.address,
        phone_number: values.phone_number,
        insurance_provider: values.insurance_provider,
      };

      console.log("Profile Data being sent:", profileData);

      if (profile) {
        await updatePatientProfile(patientId, profileData);
        message.success("Profile updated successfully!");
      } else {
        await createPatientProfile(patientId, profileData);
        message.success("Profile created successfully!");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        message.error(`Error: ${error.response.data.detail || "Bad Request"}`);
      } else {
        message.error("Error submitting profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin tip="Loading data..." />;
  }

  return (
    <Card
      title={
        patient
          ? `Profile of ${patient.first_name} ${patient.last_name}`
          : "New Patient Profile"
      }
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Patient fields */}
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: "Please enter first name" }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: "Please enter last name" }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter email" }]}
        >
          <Input type="email" placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="date_of_birth"
          rules={[{ required: true, message: "Please enter date of birth" }]}
        >
          <Input type="date" />
        </Form.Item>

        {/* PatientProfile fields */}
        <Form.Item
          label="Race/Ethnicity"
          name="race_ethnicity"
          rules={[{ required: true, message: "Please select race/ethnicity" }]}
        >
          <Select placeholder="Select your race/ethnicity">
            {raceEthnicityOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <TextArea placeholder="Enter address" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone_number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item label="Insurance Provider" name="insurance_provider">
          <Input placeholder="Enter insurance provider" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {profile ? "Update Profile" : "Create Profile"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PatientProfileForm;
