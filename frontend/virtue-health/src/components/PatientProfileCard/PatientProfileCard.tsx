// PatientProfileCard.tsx

import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spin,
  message,
  Descriptions,
  Row,
  Col,
  Avatar,
  Breadcrumb,
} from "antd";
import { calculateAge } from "../../services/formatService";
import { getPatient, getPatientProfile } from "../../services/patientService";
import { Patient, PatientProfile } from "../../services/patientService";
import { getIdFromToken } from "../../services/authService";
import PatientProfileForm from "../PatientProfileForm/PatientProfileForm";
import VirtueLogo from "../../assets/VirtueLogo.png";

const genderMap = {
  MALE: "Male",
  FEMALE: "Female",
};

const PatientProfileCard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);

  const patientId = getIdFromToken(localStorage.getItem("access_token") || "");

  useEffect(() => {
    if (!patientId) {
      message.error("No patient ID found.");
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedPatient = await getPatient(patientId);
        const fetchedProfile = await getPatientProfile(patientId);
        setPatient(fetchedPatient);
        setProfile(fetchedProfile);
      } catch (error) {
        message.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  if (loading) {
    return <Spin tip="Loading data..." />;
  }

  const handleSaveProfile = (updatedProfile: PatientProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
    message.success("Profile saved successfully!");
  };

  // Display default message and create button if no profile exists
  if (!profile && !isEditing) {
    return (
      <Card title="No Profile Found" style={{ textAlign: "center" }}>
        <p>No profile information is available.</p>
        <Button type="primary" onClick={() => setIsEditing(true)}>
          Create Profile
        </Button>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <PatientProfileForm
        patient={patient}
        profile={profile}
        onSave={handleSaveProfile}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Display the profile in view mode
  const age = calculateAge(patient?.date_of_birth);
  const items = [
    { label: "Phone", children: profile?.phone_number || "Not provided" },
    { label: "Email", children: patient?.email || "Not provided" },
    { label: "Address", children: profile?.address || "Not provided" },
    {
      label: "Insurance",
      children: profile?.insurance_provider || "Not provided",
    },
    {
      label: "Race/Ethnicity",
      children: profile?.race_ethnicity || "Not provided",
    },
  ];

  const emergencyItems = [
    { label: "Name", children: profile?.emergency_name || "Not provided" },
    { label: "Phone", children: profile?.emergency_contact || "Not provided" },
    {
      label: "Relationship",
      children: profile?.emergency_relationship || "Not provided",
    },
  ];

  return (
    <div>
      <Row style={{ paddingBottom: "0" }}>
        <Breadcrumb items={[{ title: "Home" }, { title: "My Profile" }]} />
      </Row>
      <Card
        title="My Profile"
        style={{ textAlign: "start", marginTop: "10px" }}
      >
        <Row>
          <Col span={8}>
            <h1>
              {patient?.first_name} {patient?.last_name}
            </h1>
            <h2>
              {genderMap[profile?.gender]}, {age} years old
            </h2>
          </Col>
          <Col span={8} offset={8}>
            <Avatar src={profile?.img_url || VirtueLogo} size={224} />
          </Col>
        </Row>
        <Descriptions title="Contact Information" items={items} />
        <Descriptions
          title="Emergency Contact Info"
          items={emergencyItems}
          style={{ paddingTop: "12px" }}
        />
        <Button
          type="primary"
          onClick={() => setIsEditing(true)}
          style={{ marginTop: 16 }}
        >
          Edit Profile
        </Button>
      </Card>
    </div>
  );
};

export default PatientProfileCard;
