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
  Breadcrumb,
} from "antd";
import { specialtyMap } from "../../services/doctorService";
import {
  Doctor,
  DoctorProfile,
  getDoctor,
  getDoctorProfile,
} from "../../services/doctorService";
import { getIdFromToken } from "../../services/authService";
import DoctorProfileForm from "../DoctorProfileForm/DoctorProfileForm";

const DoctorProfileCard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const doctorId = getIdFromToken(localStorage.getItem("access_token") || "");

  useEffect(() => {
    if (!doctorId) {
      message.error("No doctor ID found.");
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedDoctor = await getDoctor(doctorId);
        const fetchedProfile = await getDoctorProfile(doctorId);
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

  if (isEditing) {
    return (
      <DoctorProfileForm
        doctor={doctor}
        profile={profile}
        onSave={(updatedProfile) => {
          setProfile(updatedProfile);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Phone",
      children: profile?.phone_number || "Not provided",
    },
    { key: "2", label: "Fax", children: profile?.fax_number || "Not provided" },
    { key: "3", label: "Email", children: doctor?.email || "Not provided" },
    {
      key: "4",
      label: "Primary Location",
      children: profile?.location || "Not provided",
    },
    {
      key: "5",
      label: "Languages",
      children: profile?.languages || "Not provided",
    },
  ];

  const EducationItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Medical School",
      children: profile?.medical_school || "Not provided",
    },
    {
      key: "2",
      label: "Residency Program",
      children: profile?.residency_program || "Not provided",
    },
  ];

  return (
    <div>
      <Row style={{ paddingBottom: "0" }}>
        <Breadcrumb items={[{ title: "Home" }, { title: "My Profile" }]} />
      </Row>
      <Card
        title={"My Profile"}
        style={{ textAlign: "start", marginTop: "10px" }}
      >
        <Row>
          <Col span={24}>
            <h1>
              {doctor?.last_name}, {doctor?.first_name}, MD
            </h1>
            <h2>{specialtyMap[profile?.specialty]}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Descriptions
              title={"Contact Info"}
              items={items}
              style={{ justifyContent: "center" }}
            />
          </Col>
        </Row>
        <Row>
          <Col style={{ justifyContent: "center", paddingTop: "12px" }}>
            <Descriptions
              title={"Education"}
              items={EducationItems}
              style={{ justifyContent: "center" }}
            />
            <Button type="primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DoctorProfileCard;
