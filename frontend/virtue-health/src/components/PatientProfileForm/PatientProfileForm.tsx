import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, message, Select } from "antd";
import {
  updatePatient,
  updatePatientProfile,
  createPatientProfile,
} from "../../services/patientService";
import { Patient, PatientProfile } from "../../services/patientService";

const { TextArea } = Input;
const { Option } = Select;

interface PatientProfileFormProps {
  patient: Patient | null;
  profile: PatientProfile | null;
  onSave: (updatedProfile: PatientProfile) => void;
  onCancel: () => void;
}

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

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const PatientProfileForm: React.FC<PatientProfileFormProps> = ({
  patient,
  profile,
  onSave,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (patient) {
      form.setFieldsValue({
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email,
        date_of_birth: patient.date_of_birth,
        gender: profile?.gender || undefined,
        phone_number: profile?.phone_number || undefined,
        address: profile?.address || undefined,
        insurance_provider: profile?.insurance_provider || undefined,
        race_ethnicity: profile?.race_ethnicity || undefined,
        emergency_name: profile?.emergency_name || undefined,
        emergency_contact: profile?.emergency_contact || undefined,
        emergency_relationship: profile?.emergency_relationship || undefined,
      });
    }
  }, [patient, profile, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const patientData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        date_of_birth: values.date_of_birth,
      };
      await updatePatient(patient?.id || 0, patientData);

      const profileData: Partial<PatientProfile> = {
        gender: values.gender,
        phone_number: values.phone_number,
        address: values.address,
        insurance_provider: values.insurance_provider,
        race_ethnicity: values.race_ethnicity,
        emergency_name: values.emergency_name,
        emergency_contact: values.emergency_contact,
        emergency_relationship: values.emergency_relationship,
      };

      let updatedProfile;
      if (profile) {
        updatedProfile = await updatePatientProfile(
          patient?.id || 0,
          profileData
        );
        message.success("Profile updated successfully!");
      } else {
        updatedProfile = await createPatientProfile(
          patient?.id || 0,
          profileData
        );
        message.success("Profile created successfully!");
      }

      onSave(updatedProfile); // Notify parent component
    } catch (error: any) {
      if (error.response?.data) {
        const backendErrors = error.response.data;
        Object.keys(backendErrors).forEach((field) => {
          form.setFields([
            {
              name: field,
              errors: [backendErrors[field]],
            },
          ]);
        });
      } else {
        message.error("Error saving profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields(); // Reset form fields to initial values
    onCancel();
  };

  const formTitle = profile
    ? `Edit Profile of ${patient?.first_name || "Patient"}`
    : "Create New Patient Profile";

  return (
    <Card title={formTitle} style={{ width: "100%", maxWidth: 800 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ width: "100%", maxWidth: 800 }}
      >
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
          label="Date of Birth"
          name="date_of_birth"
          rules={[{ required: true, message: "Please enter date of birth" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone_number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <TextArea placeholder="Enter address" />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select gender" }]}
        >
          <Select placeholder="Select gender">
            {genderOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Race/Ethnicity"
          name="race_ethnicity"
          rules={[{ required: true, message: "Please select race/ethnicity" }]}
        >
          <Select placeholder="Select race/ethnicity">
            {raceEthnicityOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Emergency Contact Name"
          name="emergency_name"
          rules={[
            { required: true, message: "Please enter emergency contact name" },
          ]}
        >
          <Input placeholder="Enter emergency contact name" />
        </Form.Item>

        <Form.Item
          label="Emergency Contact Number"
          name="emergency_contact"
          rules={[
            {
              required: true,
              message: "Please enter emergency contact number",
            },
          ]}
        >
          <Input placeholder="Enter emergency contact number" />
        </Form.Item>

        <Form.Item
          label="Emergency Contact Relationship"
          name="emergency_relationship"
          rules={[
            {
              required: true,
              message: "Please enter emergency contact relationship",
            },
          ]}
        >
          <Input placeholder="Enter emergency contact relationship" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {profile ? "Save Changes" : "Create Profile"}
          </Button>
          <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PatientProfileForm;
