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
  Upload,
  Avatar,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  Doctor,
  DoctorProfile,
  getDoctor,
  getDoctorProfile,
  createDoctorProfile,
  updateDoctorProfile,
  updateDoctor,
} from "../../services/doctorService";
import { getIdFromToken, getRoleFromToken } from "../../services/authService";
import { Link } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;

const specialtyMap = [
  { value: "GENERAL_DOCTOR", label: "General Doctor" },
  { value: "CARDIOLOGIST", label: "Cardiologist" },
  { value: "ORTHOPEDIST", label: "Orthopedist" },
  { value: "NEUROLOGIST", label: "Neurologist" },
  { value: "PSYCHIATRIST", label: "Psychiatrist" },
  { value: "PEDIATRICIAN", label: "Pediatrician" },
];

const getLoggedInDoctorId = (): number | null => {
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

const DoctorProfileForm: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [form] = Form.useForm();

  const token = localStorage.getItem("access_token");
  const userRole = token ? getRoleFromToken(token) : null;

  // Get logged-in doctor's ID
  const doctorId = getLoggedInDoctorId();
  console.log(doctorId);

  useEffect(() => {
    if (!doctorId) {
      message.error("No doctor ID found.");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedDoctor = await getDoctor(doctorId);
        setDoctor(fetchedDoctor);

        const fetchedProfile = await getDoctorProfile(doctorId);
        setProfile(fetchedProfile);

        if (fetchedDoctor) {
          form.setFieldsValue({
            first_name: fetchedDoctor.first_name,
            last_name: fetchedDoctor.last_name,
            specialty: fetchedProfile?.specialty || undefined,
            date_of_birth: fetchedDoctor.date_of_birth,
            phone_number: fetchedProfile?.phone_number || undefined,
            fax_number: fetchedProfile?.fax_number || undefined,
            email: fetchedDoctor.email,
            location: fetchedProfile?.location || undefined,
            insurance_provider: fetchedProfile?.languages || undefined,
            languages: fetchedProfile?.languages || undefined,
            medical_school: fetchedProfile?.medical_school || undefined,
            residency_program: fetchedProfile?.residency_program || undefined,
          });
        }
      } catch (error) {
        message.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId, form]);

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // Update Doctor data
      const doctorData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        date_of_birth: values.date_of_birth,
      };

      console.log("Doctor Data being sent:", doctorData);
      await updateDoctor(doctorId, doctorData);

      // Update DoctorProfile data
      const profileData = {
        specialty: values.specialty, // Use the selected value directly
        location: values.location,
        phone_number: values.phone_number,
        fax_number: values.fax_number,
        languages: values.languages,
        medical_school: values.medical_school,
        residency_program: values.residency_program,
      };

      console.log("Profile Data being sent:", profileData);

      if (profile) {
        await updateDoctorProfile(doctorId, profileData, profileImage); // Add profile image
        message.success("Profile updated successfully!");
      } else {
        await createDoctorProfile(doctorId, profileData, profileImage); // Add profile image
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

  // Handle image upload
  const handleImageUpload = (info: any) => {
    if (info.file.status === "done") {
      // Assuming the backend returns the image URL in the response
      setProfileImage(info.file.originFileObj);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // Create breadcrumb items based on the user role
  const breadcrumbItems = [
    {
      title: "Home",
    },
    {
      title:
        userRole === "DOCTOR" ? (
          <Link to="/doctor-dashboard/view-profile">Doctor List</Link>
        ) : userRole === "PATIENT" ? (
          <Link to="/patient-portal/view-profile">Doctor List</Link>
        ) : null,
    },
    {
      title: "My Profile",
    },
  ];

  if (loading) {
    return <Spin tip="Loading data..." />;
  }

  return (
    <div>
      <Row style={{ paddingBottom: "24px" }}>
        <Breadcrumb items={breadcrumbItems.filter((item) => item.title)} />
      </Row>
      <Card
        title={
          doctor
            ? `Profile of ${doctor.first_name} ${doctor.last_name}`
            : "New Doctor Profile"
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
          <Form.Item label="Profile Image" name="profile_image">
            <Upload
              name="profile_image"
              listType="picture"
              showUploadList={false}
              beforeUpload={() => false} // Prevent automatic upload
              onChange={handleImageUpload}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {profileImage && (
              <Avatar
                src={URL.createObjectURL(profileImage)}
                size={128}
                style={{ marginTop: 10 }}
              />
            )}
          </Form.Item>

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
            label="Fax Number"
            name="fax_number"
            rules={[{ required: true, message: "Please enter fax number" }]}
          >
            <Input placeholder="Enter fax number" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input type="email" placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Specialty"
            name="specialty"
            rules={[{ required: true, message: "Please select specialty" }]}
          >
            <Select placeholder="Select your specialty">
              {specialtyMap.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Primary Location"
            name="location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <TextArea placeholder="Enter location" />
          </Form.Item>

          <Form.Item
            label="Languages"
            name="languages"
            rules={[{ required: true, message: "Please enter languages" }]}
          >
            <TextArea placeholder="Enter languages" />
          </Form.Item>

          <Form.Item
            label="Medical School"
            name="medical_school"
            rules={[{ required: true, message: "Please enter medical school" }]}
          >
            <TextArea placeholder="Enter medical school" />
          </Form.Item>

          <Form.Item
            label="Residency Program"
            name="residency_program"
            rules={[
              { required: true, message: "Please enter residency program" },
            ]}
          >
            <TextArea placeholder="Enter residency program" />
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

export default DoctorProfileForm;
