import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Select } from "antd";
import {
  createPatientProfile,
  getPatientProfile,
  Patient,
  PatientProfile,
  updatePatientProfile,
} from "../../services/patientService";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const PatientProfileView: React.FC = () => {
  const [form] = Form.useForm();
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(
    null
  );
  const navigate = useNavigate();
  const patientId = 44; // Assume this is obtained from the authenticated user's session or another source

  useEffect(() => {
    // Fetch the patient profile on component mount
    const fetchProfile = async () => {
      try {
        const profile = await getPatientProfile(patientId);
        setPatientProfile(profile);
        form.setFieldsValue(profile); // Populate form fields
      } catch (error) {
        console.error("Failed to fetch patient profile:", error);
      }
    };
    fetchProfile();
  }, [form, patientId]);

  const onFinish = async (values: Partial<PatientProfile>) => {
    try {
      if (patientProfile) {
        await updatePatientProfile(patientProfile.user.id, values);
        message.success("Profile updated successfully");
      } else {
        await createPatientProfile({
          ...values,
          user: { id: patientId } as Patient,
        } as PatientProfile);
        message.success("Profile created successfully");
      }
      navigate("/patient-portal");
    } catch (error) {
      message.error("Failed to save profile. Please try again.");
      console.error("Save profile error:", error);
    }
  };

  return (
    <div>
      <h2>{patientProfile ? "Edit Profile" : "Create Profile"}</h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="phone_number"
          label="Phone Number"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="insurance_provider" label="Insurance Provider">
          <Input />
        </Form.Item>
        <Form.Item
          name="race_ethnicity"
          label="Race/Ethnicity"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select your race/ethnicity">
            <Option value="WHITE">White (not of Hispanic origin)</Option>
            <Option value="BLACK">Black (not of Hispanic origin)</Option>
            <Option value="HISPANIC_LATINO">Hispanic or Latino</Option>
            <Option value="ASIAN">Asian</Option>
            <Option value="AMERICAN_INDIAN_NATIVE_ALASKAN">
              American Indian or Alaska Native
            </Option>
            <Option value="NATIVE_HAWAIIAN_PACIFIC_ISLANDER">
              Native Hawaiian or Pacific Islander
            </Option>
          </Select>
        </Form.Item>
        <Form.Item name="medical_record" label="Medical Record">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {patientProfile ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PatientProfileView;
