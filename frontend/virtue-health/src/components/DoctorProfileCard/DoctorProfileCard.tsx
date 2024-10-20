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
import {
  Doctor,
  DoctorProfile,
  getDoctor,
  getDoctorProfile,
} from "../../services/doctorService";
import { getIdFromToken } from "../../services/authService";
import VirtueLogo from "../../assets/VirtueLogo.png";

const specialtyMap = {
  GENERAL_DOCTOR: "General Doctor",
  CARDIOLOGIST: "Cardiologist",
  ORTHOPEDIST: "Orthopedist",
  NEUROLOGIST: "Neurologist",
  PSYCHIATRIST: "Psychiatrist",
  PEDIATRICIAN: "Pediatrician",
};

const DoctorProfileCard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
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

  const doctorId = getLoggedInPatientId();

  useEffect(() => {
    if (!doctorId) {
      message.error("No patient ID found.");
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedDoctor = await getDoctor(doctorId);
        const fetchedProfile = await getDoctorProfile(doctorId);
        console.log(fetchedDoctor);
        console.log(fetchedProfile);

        setDoctor(fetchedDoctor);
        setProfile(fetchedProfile);
      } catch (error) {
        message.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId]);

  if (loading) {
    return <Spin tip="Loading data..." />;
  }

  // Use patient's image if provided, otherwise fall back to the default image
  const imgSrc = profile?.img_url || VirtueLogo;

  // Calculate patient's age
  const dob = doctor?.date_of_birth;
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
      children: profile?.fax_number || "Not provided",
    },
    {
      key: "3",
      label: "Address",
      children: doctor?.email || "Not provided",
    },
    {
      key: "4",
      label: "Insurance",
      children: profile?.fax_number || "Not provided",
    },
    {
      key: "5",
      label: "Race/Ethnicity",
      children: profile?.schedule || "Not provided",
    },
  ];
  const EmergencyItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Name",
      children: profile?.medical_school || "Not provided",
    },
    {
      key: "2",
      label: "Phone",
      children: profile?.residency_program || "Not provided",
    },
    {
      key: "3",
      label: "Relationship",
      children: profile?.languages || "Not provided",
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
              {doctor?.first_name} {doctor?.last_name}
            </h1>
            <h2>{specialtyMap[profile?.specialty]}</h2>
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

export default DoctorProfileCard;
