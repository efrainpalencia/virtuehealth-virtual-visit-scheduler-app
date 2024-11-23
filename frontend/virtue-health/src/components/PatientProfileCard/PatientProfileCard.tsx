import React, { useEffect, useState } from "react";
import { Card, Button, Spin, message, Descriptions, Row, Col } from "antd";
import {
  getPatient,
  getPatientProfile,
  updatePatientProfile,
  createPatientProfile,
} from "../../services/patientService";
import { Patient, PatientProfile } from "../../services/patientService";
import { getIdFromToken } from "../../services/authService";
import PatientProfileForm from "../PatientProfileForm/PatientProfileForm";
import { calculateAge } from "../../services/formatService";

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
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!patientId) throw new Error("No patient ID found.");

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

  const handleSaveProfile = async (updatedProfile: PatientProfile) => {
    try {
      if (profile) {
        const savedProfile = await updatePatientProfile(
          patientId,
          updatedProfile
        );
        setProfile(savedProfile);
        message.success("Profile updated successfully!");
      } else {
        const createdProfile = await createPatientProfile(
          patientId,
          updatedProfile
        );
        setProfile(createdProfile);
        message.success("Profile created successfully!");
      }
      setIsEditing(false);
    } catch {
      message.error("Failed to save profile. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading) {
    return <Spin tip="Loading data..." />;
  }

  if (isEditing) {
    return (
      <PatientProfileForm
        patient={patient}
        profile={profile}
        onSave={handleSaveProfile}
        onCancel={handleCancelEdit}
      />
    );
  }

  const age = patient?.date_of_birth
    ? calculateAge(patient.date_of_birth)
    : "N/A";

  return (
    <Card title="My Profile">
      <Row>
        <Col span={24}>
          <h1>
            {patient?.first_name} {patient?.last_name}
          </h1>
          <h2>
            {genderMap[profile?.gender]}, {age} years old
          </h2>
        </Col>
      </Row>
      <Descriptions title="Contact Information">
        <Descriptions.Item label="Phone">
          {profile?.phone_number || "Not provided"}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {patient?.email || "Not provided"}
        </Descriptions.Item>
        <Descriptions.Item label="Address">
          {profile?.address || "Not provided"}
        </Descriptions.Item>
        <Descriptions.Item label="Insurance">
          {profile?.insurance_provider || "Not provided"}
        </Descriptions.Item>
        <Descriptions.Item label="Race/Ethnicity">
          {profile?.race_ethnicity || "Not provided"}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions
        title="Emergency Contact Info"
        style={{ paddingTop: "12px" }}
      >
        <Descriptions.Item label="Name">
          {profile?.emergency_name || "Not provided"}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {profile?.emergency_contact || "Not provided"}
        </Descriptions.Item>
        <Descriptions.Item label="Relationship">
          {profile?.emergency_relationship || "Not provided"}
        </Descriptions.Item>
      </Descriptions>
      <Button
        type="primary"
        onClick={() => setIsEditing(true)}
        style={{ marginTop: 16 }}
      >
        Edit Profile
      </Button>
    </Card>
  );
};

export default PatientProfileCard;
