// DoctorProfileForm.tsx

import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, message, Select } from "antd";
import {
  Doctor,
  DoctorProfile,
  createDoctorProfile,
  updateDoctorProfile,
  updateDoctor,
} from "../../services/doctorService";

const { TextArea } = Input;
const { Option } = Select;

interface DoctorProfileFormProps {
  doctor: Doctor | null;
  profile: DoctorProfile | null;
  onSave: (updatedProfile: DoctorProfile) => void;
  onCancel: () => void;
}

const selectSpecialtyMap = [
  { value: "GENERAL_DOCTOR", label: "General Doctor" },
  { value: "CARDIOLOGIST", label: "Cardiologist" },
  { value: "ORTHOPEDIST", label: "Orthopedist" },
  { value: "NEUROLOGIST", label: "Neurologist" },
  { value: "PSYCHIATRIST", label: "Psychiatrist" },
  { value: "PEDIATRICIAN", label: "Pediatrician" },
];

const DoctorProfileForm: React.FC<DoctorProfileFormProps> = ({
  doctor,
  profile,
  onSave,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (doctor) {
      form.setFieldsValue({
        first_name: doctor.first_name,
        last_name: doctor.last_name,
        email: doctor.email,
        date_of_birth: doctor.date_of_birth,
        specialty: profile?.specialty || undefined,
        phone_number: profile?.phone_number || undefined,
        fax_number: profile?.fax_number || undefined,
        location: profile?.location || undefined,
        languages: profile?.languages || undefined,
        medical_school: profile?.medical_school || undefined,
        residency_program: profile?.residency_program || undefined,
      });
    }
  }, [doctor, profile, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const doctorData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        date_of_birth: values.date_of_birth,
      };
      await updateDoctor(doctor?.id || 0, doctorData);

      const profileData = {
        specialty: values.specialty,
        location: values.location,
        phone_number: values.phone_number,
        fax_number: values.fax_number,
        languages: values.languages,
        medical_school: values.medical_school,
        residency_program: values.residency_program,
      };

      let updatedProfile;
      if (profile) {
        updatedProfile = await updateDoctorProfile(
          doctor?.id || 0,
          profileData
        );
        message.success("Profile updated successfully!");
      } else {
        updatedProfile = await createDoctorProfile(
          doctor?.id || 0,
          profileData
        );
        message.success("Profile created successfully!");
      }

      onSave(updatedProfile); // Notify parent component
    } catch (error) {
      message.error("Error saving profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={`Edit Profile of ${doctor?.first_name || "Doctor"}`}
      style={{ width: 800 }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="date_of_birth"
          rules={[{ required: true, message: "Please enter date of birth" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="Specialty"
          name="specialty"
          rules={[{ required: true, message: "Please select specialty" }]}
        >
          <Select placeholder="Select specialty">
            {selectSpecialtyMap.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <TextArea placeholder="Enter location" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone_number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 14, offset: 18 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default DoctorProfileForm;
