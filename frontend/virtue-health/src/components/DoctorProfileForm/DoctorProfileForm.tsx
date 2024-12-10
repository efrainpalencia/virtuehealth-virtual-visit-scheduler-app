import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, message, Select } from "antd";
import {
  Doctor,
  DoctorProfile,
  createDoctorProfile,
  updateDoctorProfile,
  updateDoctor,
  getDoctorProfile,
} from "../../services/doctorService";

const { TextArea } = Input;
const { Option } = Select;

interface DoctorProfileFormProps {
  doctor: Doctor | null;
  onSave: (updatedProfile: DoctorProfile) => void;
  onCancel: () => void;
}

const specialtyOptions = [
  { value: "GENERAL_DOCTOR", label: "General Doctor" },
  { value: "CARDIOLOGIST", label: "Cardiologist" },
  { value: "ORTHOPEDIST", label: "Orthopedist" },
  { value: "NEUROLOGIST", label: "Neurologist" },
  { value: "PSYCHIATRIST", label: "Psychiatrist" },
  { value: "PEDIATRICIAN", label: "Pediatrician" },
];

const DoctorProfileForm: React.FC<DoctorProfileFormProps> = ({
  doctor,
  onSave,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (doctor) {
        try {
          console.log("DoctorId: ", doctor.id);
          const fetchedProfile = await getDoctorProfile(doctor.id);
          if (fetchedProfile) {
            setProfile(fetchedProfile);
            form.setFieldsValue({ ...doctor, ...fetchedProfile });
          } else {
            form.setFieldsValue({ ...doctor });
          }
        } catch (error) {
          console.error("Error fetching doctor profile:", error);
          message.error("Failed to load doctor profile.");
        }
      }
    };

    fetchDoctorProfile();
  }, [doctor, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Update doctor general information
      if (doctor) {
        const doctorData = {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          date_of_birth: values.date_of_birth,
        };

        await updateDoctor(doctor.id, doctorData);
        message.success("Doctor information updated successfully!");
      }

      // Update or create doctor profile information
      const profileData = {
        user: doctor?.id, // Include the doctor user ID in the payload
        specialty: values.specialty,
        location: values.location,
        phone_number: values.phone_number,
        fax_number: values.fax_number,
        languages: values.languages,
        medical_school: values.medical_school,
        residency_program: values.residency_program,
        schedule: profile?.schedule || [], // Add schedule only if it's not empty
      };

      let updatedProfile;
      if (profile) {
        // Update profile if it exists
        updatedProfile = await updateDoctorProfile(
          doctor?.id || 0,
          profileData
        );
        message.success("Profile updated successfully!");
      } else {
        // Create profile if it doesn't exist
        updatedProfile = await createDoctorProfile(profileData);
        message.success("Profile created successfully!");
      }

      // Save the updated profile
      onSave(updatedProfile);
    } catch (error) {
      console.error("Error saving profile:", error.response?.data || error);
      message.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={`Edit Profile of ${doctor?.first_name || "Doctor"}`}
      style={{ width: "100%", maxWidth: 800 }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Doctor's General Information */}
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
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
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

        {/* Doctor's Profile Information */}
        <Form.Item
          label="Specialty"
          name="specialty"
          rules={[{ required: true, message: "Please select specialty" }]}
        >
          <Select placeholder="Select specialty">
            {specialtyOptions.map((option) => (
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
          <TextArea rows={2} placeholder="Enter location" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone_number"
          rules={[
            { required: true, message: "Please enter phone number" },
            {
              pattern: /^\+?[1-9]\d{1,14}$/,
              message: "Please enter a valid phone number",
            },
          ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          label="Fax Number"
          name="fax_number"
          rules={[
            {
              pattern: /^\+?[1-9]\d{1,14}$/,
              message: "Please enter a valid fax number",
            },
          ]}
        >
          <Input placeholder="Enter fax number" />
        </Form.Item>

        <Form.Item
          label="Languages"
          name="languages"
          rules={[
            { required: false, message: "Please enter languages spoken" },
          ]}
        >
          <Input placeholder="Enter languages (comma-separated)" />
        </Form.Item>

        <Form.Item
          label="Medical School"
          name="medical_school"
          rules={[{ required: false, message: "Please enter medical school" }]}
        >
          <Input placeholder="Enter medical school" />
        </Form.Item>

        <Form.Item
          label="Residency Program"
          name="residency_program"
          rules={[
            { required: false, message: "Please enter residency program" },
          ]}
        >
          <Input placeholder="Enter residency program" />
        </Form.Item>

        {/* Buttons */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginRight: 8 }}
          >
            Save Changes
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default DoctorProfileForm;
