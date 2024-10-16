import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spin,
  message,
  DescriptionsProps,
  Descriptions,
  Row,
  Col,
  Avatar,
  Breadcrumb,
} from "antd";
import { useNavigate } from "react-router-dom";
import { calculateAge } from "../../services/formatService";
import { getPatient, getPatientProfile } from "../../services/patientService";
import { Patient, PatientProfile } from "../../services/patientService";
import { getIdFromToken } from "../../services/authService";
import VirtueLogo from "../../assets/VirtueLogo.png";

const genderMap = {
  MALE: "Male",
  FEMALE: "Female",
};

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

  // Use patient's image if provided, otherwise fall back to the default image
  const imgSrc = patient?.img_url || VirtueLogo;

  // Calculate patient's age
  const dob = patient?.date_of_birth;
  const age = calculateAge(dob);

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Phone",
      children: profile?.phone_number || "Not provided",
    },
    {
      key: "2",
      label: "Email",
      children: patient?.email || "Not provided",
    },
    {
      key: "3",
      label: "Address",
      children: profile?.address || "Not provided",
    },
    {
      key: "4",
      label: "Insurance",
      children: profile?.insurance_provider || "Not provided",
    },
    {
      key: "5",
      label: "Race/Ethnicity",
      children: profile?.race_ethnicity || "Not provided",
    },
  ];
  const EmergencyItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Name",
      children: profile?.emergency_name || "Not provided",
    },
    {
      key: "2",
      label: "Phone",
      children: profile?.emergency_contact || "Not provided",
    },
    {
      key: "3",
      label: "Relationship",
      children: profile?.emergency_relationship || "Not provided",
    },
  ];

  return (
    <div>
      <Row style={{ paddingBottom: "0" }}>
        <Breadcrumb
          items={[
            {
              title: "Home",
            },
            {
              title: "My Profile",
            },
          ]}
        />
      </Row>
      <Row gutter={16}>
        <Col span={8} offset={20} style={{ paddingTop: "5px" }}>
          <Button type="primary" onClick={() => navigate("edit-profile")}>
            Edit Profile
          </Button>
        </Col>
      </Row>

      <Card
        title={"My Profile"}
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
            <Avatar src={imgSrc} size={224} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Descriptions items={items} style={{ justifyContent: "center" }} />
          </Col>
        </Row>
        <Row>
          <Col style={{ justifyContent: "center", paddingTop: "12px" }}>
            <Descriptions
              title={"Emergency Contact Info"}
              items={EmergencyItems}
              style={{ justifyContent: "center", paddingTop: "12px" }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PatientProfileCard;
