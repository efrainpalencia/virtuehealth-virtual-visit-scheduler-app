import React, { useEffect, useState } from "react";
import { Card, Button, Spin, message, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { getPatient, getPatientProfile } from "../../services/patientService";
import { Patient, PatientProfile } from "../../services/patientService";
import { getIdFromToken } from "../../services/authService";

const PatientProfileCard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const navigate = useNavigate();

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

  const patientId = getLoggedInPatientId();

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
        console.log(fetchedPatient);
        console.log(fetchedProfile);

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

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <Card
        title={
          patient
            ? `Profile of ${patient.first_name} ${patient.last_name}`
            : "Patient Profile"
        }
        style={{ textAlign: "center", marginTop: "50px", padding: "0 50px" }}
      >
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <Button type="primary" onClick={() => navigate("/edit-profile")}>
            Edit Profile
          </Button>
          <span className="mock-block"></span>
        </Space>
        <p>
          <strong>First Name:</strong> {patient?.first_name}
        </p>
        <p>
          <strong>Last Name:</strong> {patient?.last_name}
        </p>
        <p>
          <strong>Email:</strong> {patient?.email}
        </p>
        <p>
          <strong>Date of Birth:</strong> {patient?.date_of_birth}
        </p>
        <p>
          <strong>Race/Ethnicity:</strong> {profile?.race_ethnicity}
        </p>
        <p>
          <strong>Address:</strong> {profile?.address}
        </p>
        <p>
          <strong>Phone Number:</strong> {profile?.phone_number}
        </p>
        <p>
          <strong>Insurance Provider:</strong> {profile?.insurance_provider}
        </p>
      </Card>
    </Space>
  );
};

export default PatientProfileCard;
