import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Spin,
  Select,
  Row,
  Breadcrumb,
} from "antd";
import {
  getPatient,
  getPatientProfile,
  createPatientProfile,
  updatePatientProfile,
  updatePatient,
} from "../../services/patientService"; // Adjust path
import { Patient, PatientProfile } from "../../services/patientService"; // Adjust path
import { getIdFromToken } from "../../services/authService";
import { Link } from "react-router-dom";

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

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
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
            gender: fetchedProfile?.gender || undefined,
            date_of_birth: fetchedPatient.date_of_birth,
            phone_number: fetchedProfile?.phone_number || undefined,
            email: fetchedPatient.email,
            address: fetchedProfile?.address || undefined,
            insurance_provider: fetchedProfile?.insurance_provider || undefined,
            race_ethnicity: fetchedProfile?.race_ethnicity || undefined,
            emergency_name: fetchedProfile?.emergency_name || undefined,
            emergency_contact: fetchedProfile?.emergency_contact || undefined,
            emergency_relationship:
              fetchedProfile?.emergency_relationship || undefined,
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
        gender: values.gender,
        emergency_name: values.emergency_name,
        emergency_contact: values.emergency_contact,
        emergency_relationship: values.emergency_relationship,
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
    <div>
      <Row style={{ paddingBottom: "24px" }}>
        <Breadcrumb
          items={[
            {
              title: "Home",
            },
            {
              title: (
                <Link to={`/patient-portal/view-profile`}>My Profile</Link>
              ),
            },
            {
              title: "Edit My Profile",
            },
          ]}
        />
      </Row>
      <Card
        title={
          patient
            ? `Profile of ${patient.first_name} ${patient.last_name}`
            : "New Patient Profile"
        }
        style={{ width: 800 }}
      >
        <Form
          form={form}
          labelCol={{ flex: "180px" }}
          labelAlign="right"
          labelWrap
          wrapperCol={{ span: 24, offset: 0 }}
          style={{ maxWidth: 600 }}
          onFinish={handleSubmit}
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
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input type="email" placeholder="Enter email" />
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
            <Select placeholder="Select your gender">
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
            rules={[
              { required: true, message: "Please select race/ethnicity" },
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

          <Form.Item label="Insurance Provider" name="insurance_provider">
            <Input placeholder="Enter insurance provider" />
          </Form.Item>

          <Form.Item
            label="Emergency Contact Name"
            name="emergency_name"
            rules={[
              {
                required: true,
                message: "Please enter emergency contact name",
              },
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
                message: "Please enter relationship to emergency contact",
              },
            ]}
          >
            <Input placeholder="Enter relationship to emergency contact" />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 14, offset: 18 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              {profile ? "Update Profile" : "Create Profile"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PatientProfileForm;
