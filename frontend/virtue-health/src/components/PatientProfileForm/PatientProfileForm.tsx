import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useParams } from "react-router-dom";
import {
  getPatientProfile,
  createPatientProfile,
  updatePatientProfile,
  PatientProfile,
} from "../../services/patientService";

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

const PatientProfileForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [profile, setProfile] = useState<PatientProfile | null>(null);

  useEffect(() => {
    if (id) {
      getPatientProfile(Number(id)).then(setProfile);
    }
  }, [id]);

  const onFinish = async (values: PatientProfile) => {
    try {
      if (id) {
        await updatePatientProfile(Number(id), values);
        message.success("Profile updated successfully!");
      } else {
        await createPatientProfile(values);
        message.success("Profile created successfully!");
      }
    } catch (error) {
      message.error("An error occurred while saving the profile.");
    }
  };

  useEffect(() => {
    if (profile) {
      form.setFieldsValue(profile);
    }
  }, [profile, form]);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: "Please enter your address" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone_number"
        label="Phone Number"
        rules={[{ required: true, message: "Please enter your phone number" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="race_ethnicity"
        label="Race/Ethnicity"
        rules={[
          { required: true, message: "Please select your race/ethnicity" },
        ]}
      >
        <Select placeholder="Select your race/ethnicity">
          {raceEthnicityOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="insurance_provider" label="Insurance Provider">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {id ? "Update Profile" : "Create Profile"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PatientProfileForm;
