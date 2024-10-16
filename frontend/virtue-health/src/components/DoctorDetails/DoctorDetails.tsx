import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, Breadcrumb, Button, Col, Descriptions, Flex, Row } from "antd";
import type { DescriptionsProps } from "antd";
import {
  getDoctorsMap,
  getDoctorProfilesMap,
} from "../../services/doctorService";
import VirtueLogo from "../../assets/VirtueLogo.png";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";

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
  const imgSrc = doctor.img_url || VirtueLogo;

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Specialty",
      children: specialtyMap[doctor.specialty] || "Not provided",
    },
    {
      key: "2",
      label: "Primary Location",
      children: doctor.location || "Not provided",
    },
    {
      key: "3",
      label: "Phone",
      children: doctor.phone_number || "Not provided",
    },
    {
      key: "4",
      label: "Fax",
      children: doctor.fax_number || "Not provided",
    },
    {
      key: "5",
      label: "Email",
      children: doctor.email || "Not provided",
    },
    {
      key: "6",
      label: "Languages",
      children: doctor.languages || "Not provided",
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
      <Row gutter={16}>
        <Col span={8}>
          <h1>
            {doctor.last_name}, {doctor.first_name}, MD
          </h1>
        </Col>
        <Col span={8} offset={8}>
          <Avatar src={imgSrc} size={128} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Descriptions
          title="Doctor Info:"
          items={items}
          style={{ justifyContent: "center" }}
        />
      </Row>
      <Row gutter={16}>
        <Flex vertical gap="small" style={{ width: "25%", paddingTop: "48px" }}>
          <Button type="primary" block>
            Book A Virtual Visit
          </Button>
        </Flex>
      </Row>
    </div>
  );
};

export default DoctorDetails;
