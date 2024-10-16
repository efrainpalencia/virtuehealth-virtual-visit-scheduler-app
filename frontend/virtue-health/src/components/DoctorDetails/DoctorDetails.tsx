import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Row,
} from "antd";
import type { DescriptionsProps } from "antd";
import {
  getDoctorsMap,
  getDoctorProfilesMap,
} from "../../services/doctorService";
import VirtueLogo from "../../assets/VirtueLogo.png";

const specialtyMap = {
  GENERAL_DOCTOR: "General Doctor",
  CARDIOLOGIST: "Cardiologist",
  ORTHOPEDIST: "Orthopedist",
  NEUROLOGIST: "Neurologist",
  PSYCHIATRIST: "Psychiatrist",
  PEDIATRICIAN: "Pediatrician",
};

const DoctorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get doctor ID from the URL
  const [doctor, setDoctor] = useState<any>(null); // State to hold doctor data

  useEffect(() => {
    const fetchDoctor = async () => {
      const doctorsMap = await getDoctorsMap();
      const profilesMap = await getDoctorProfilesMap();

      const selectedDoctor = {
        ...doctorsMap[parseInt(id!)],
        ...profilesMap[parseInt(id!)],
      };

      setDoctor(selectedDoctor);
    };

    fetchDoctor();
  }, [id]);

  if (!doctor) {
    return <div>Loading...</div>;
  }

  // Use doctor's image if provided, otherwise fall back to the default image
  const imgSrc = doctor?.img_url || VirtueLogo;

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Primary Location",
      children: doctor.location || "Not provided",
    },
    {
      key: "2",
      label: "Phone",
      children: doctor.phone_number || "Not provided",
    },
    {
      key: "3",
      label: "Languages",
      children: doctor.languages || "Not provided",
    },
    {
      key: "4",
      label: "Email",
      children: doctor.email || "Not provided",
    },
    {
      key: "5",
      label: "Fax",
      children: doctor.fax_number || "Not provided",
    },
  ];

  const aboutItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Medical School",
      children: doctor.medical_school || "Not provided",
    },
    {
      key: "2",
      label: "Residency Program",
      children: doctor.residency_program || "Not provided",
    },
    {
      key: "3",
      label: "Insurance",
      children:
        "Most insurances are accepted by physicians on staff. You should contact the office for questions about financial arrangements and insurance acceptance.",
    },
  ];

  return (
    <div>
      <Row style={{ paddingBottom: "48px" }}>
        <Breadcrumb
          items={[
            {
              title: "Home",
            },
            {
              title: (
                <Link to={`/patient-portal/doctor-list`}>Doctor List</Link>
              ),
            },
            {
              title: "Doctor Details",
            },
          ]}
        />
      </Row>
      <Card
        title={"Doctor Details"}
        style={{ textAlign: "start", marginTop: "10px" }}
      >
        <Row>
          <Col span={8}>
            <h1>
              {doctor.last_name}, {doctor.first_name}, MD
            </h1>
            <h2>{specialtyMap[doctor.specialty]}</h2>
          </Col>
          <Col span={8} offset={8}>
            <Avatar src={imgSrc} size={200} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Descriptions
              title="Doctor Info:"
              items={items}
              style={{ justifyContent: "center" }}
            />
          </Col>
        </Row>
        <Row>
          <Flex
            vertical
            gap="small"
            style={{ width: "25%", paddingTop: "48px" }}
          >
            <Button type="primary" block>
              Book A Virtual Visit
            </Button>
          </Flex>
        </Row>
      </Card>
      <Card
        title={doctor ? `About Dr. ${doctor.last_name}` : "About this Doctor"}
        style={{ textAlign: "start", marginTop: "10px" }}
      >
        <Row></Row>
        <Row>
          <Col>
            <Descriptions
              title="Education"
              items={aboutItems}
              style={{ justifyContent: "center" }}
            />
          </Col>
          <Col></Col>
        </Row>
      </Card>
    </div>
  );
};

export default DoctorDetails;
