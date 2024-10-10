import React, { useEffect, useState } from "react";
import { Card, Spin, Descriptions, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  getPatient,
  getPatientProfile,
  Patient,
  PatientProfile,
} from "../../services/patientService"; // Adjust path
import { useParams } from "react-router-dom";

const PatientProfileCard: React.FC = () => {
  const { user_id } = useParams<{ user_id: string | undefined }>(); // Get patient ID from the URL
  const navigate = useNavigate(); // Used for routing
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(
    null
  );

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        // Fetch the Patient by ID
        const patientData = await getPatient(Number(user_id));
        setPatient(patientData); // Assuming response returns an array

        // Fetch the PatientProfile using user_id from the Patient
        const profileData = await getPatientProfile(Number(user_id));
        console.log(profileData);
        setPatientProfile(profileData);
      } catch (error) {
        message.error("Failed to fetch patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user_id]);

  useEffect(() => {
    if (!loading && !patientProfile) {
      // If no patient profile, redirect to another route (e.g., a profile creation page)
      message.warning("Patient profile not found, redirecting...");
      navigate("/create-profile");
    }
  }, [loading, patientProfile, navigate]);

  if (loading) {
    return <Spin tip="Loading patient data..." />;
  }

  if (!patient || !patientProfile) {
    return null; // While the redirect is happening
  }

  return (
    <Card
      title={`Patient: ${patient.first_name} ${patient.last_name}`}
      bordered={true}
    >
      <Descriptions bordered>
        <Descriptions.Item label="Email">{patient.email}</Descriptions.Item>
        <Descriptions.Item label="Date of Birth">
          {patient.date_of_birth
            ? new Date(patient.date_of_birth).toLocaleDateString()
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Role">{patient.role}</Descriptions.Item>
      </Descriptions>

      <Card
        title="Patient Profile"
        bordered={false}
        style={{ marginTop: "16px" }}
      >
        <Descriptions bordered>
          <Descriptions.Item label="Phone Number">
            {patientProfile.phone_number || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {patientProfile.address || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Insurance Provider">
            {patientProfile.insurance_provider || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Race/Ethnicity">
            {patientProfile.race_ethnicity || "N/A"}
          </Descriptions.Item>
          {/* You can add more fields from MedicalRecord here if needed */}
        </Descriptions>
      </Card>
    </Card>
  );
};

export default PatientProfileCard;
