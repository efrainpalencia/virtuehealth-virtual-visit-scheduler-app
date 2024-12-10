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
  getPatientsMap,
  getPatientProfilesMap,
} from "../../services/patientService";
import VirtueLogo from "../../assets/VirtueLogo.png";
import { getRoleFromToken } from "../../services/authService";
import { calculateAge } from "../../services/formatService";

const genderMap = {
  MALE: "Male",
  FEMALE: "Female",
};

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get doctor ID from the URL
  const [patient, setPatient] = useState<any>(null); // State to hold doctor data

  const token = localStorage.getItem("access_token");
  const userRole = token ? getRoleFromToken(token) : null;

  useEffect(() => {
    const fetchDoctor = async () => {
      const patientsMap = await getPatientsMap();
      const profilesMap = await getPatientProfilesMap();

      const selectedPatient = {
        ...patientsMap[parseInt(id!)],
        ...profilesMap[parseInt(id!)],
      };

      setPatient(selectedPatient);
    };

    fetchDoctor();
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  // Use doctor's image if provided, otherwise fall back to the default image
  const imgSrc = patient?.img_url || VirtueLogo;

  // Calculate patient's age
  const dob = patient?.date_of_birth;
  const age = calculateAge(dob);

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Phone",
      children: patient.phone_number || "Not provided",
    },
    {
      key: "2",
      label: "Email",
      children: patient.email || "Not provided",
    },
    {
      key: "3",
      label: "Address",
      children: patient.address || "Not provided",
    },
  ];

  const emergencyItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Name",
      children: patient.emergency_name || "Not provided",
    },
    {
      key: "2",
      label: "Phone",
      children: patient.emergency_contact || "Not provided",
    },
    {
      key: "3",
      label: "Relationship",
      children: patient.emergency_relationship || "Not provided",
    },
  ];

  const medicalRecordItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Medical School",
      children: patient.medical_school || "Not provided",
    },
    {
      key: "2",
      label: "Residency Program",
      children: patient.residency_program || "Not provided",
    },
    {
      key: "3",
      label: "Insurance",
      children:
        "Most insurances are accepted by physicians on staff. You should contact the office for questions about financial arrangements and insurance acceptance.",
    },
  ];

  const labResultItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Medical School",
      children: patient.medical_school || "Not provided",
    },
    {
      key: "2",
      label: "Residency Program",
      children: patient.residency_program || "Not provided",
    },
    {
      key: "3",
      label: "Insurance",
      children:
        "Most insurances are accepted by physicians on staff. You should contact the office for questions about financial arrangements and insurance acceptance.",
    },
  ];

  // Create breadcrumb items based on the user role
  const breadcrumbItems = [
    {
      title: "Home",
    },
    {
      title:
        userRole === "DOCTOR" ? (
          <Link to="/doctor-dashboard/patient-list">Patient List</Link>
        ) : userRole === "PATIENT" ? (
          <Link to="/patient-portal/patient-list">Patient List</Link>
        ) : null,
    },
    {
      title: "Patient Details",
    },
  ];

  return (
    <div>
      <Row style={{ paddingBottom: "48px" }}>
        <Breadcrumb items={breadcrumbItems.filter((item) => item.title)} />
      </Row>
      <Card
        title={"Patient Details"}
        style={{ textAlign: "start", marginTop: "10px" }}
      >
        <Row>
          <Col span={8}>
            <h1>
              {patient.last_name}, {patient.first_name}, MD
            </h1>
            <h2>
              {age} year old {genderMap[patient.gender]}
            </h2>
          </Col>
          <Col span={8} offset={8}>
            <Avatar src={imgSrc} size={200} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Descriptions
              title="Contact Info:"
              items={items}
              style={{ justifyContent: "center" }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Descriptions
              title="Emergency Contact Info:"
              items={emergencyItems}
              style={{ justifyContent: "center", paddingTop: "20px" }}
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
        title={"Medical Records"}
        style={{ textAlign: "start", marginTop: "10px" }}
      >
        <Row></Row>
        <Row>
          <Col>
            <Descriptions
              title="Education"
              items={medicalRecordItems}
              style={{ justifyContent: "center" }}
            />
          </Col>
          <Col></Col>
        </Row>
      </Card>
      <Card
        title={"Laboratory results"}
        style={{ textAlign: "start", marginTop: "10px" }}
      >
        <Row></Row>
        <Row>
          <Col>
            <Descriptions
              items={labResultItems}
              style={{ justifyContent: "center" }}
            />
          </Col>
          <Col></Col>
        </Row>
      </Card>
    </div>
  );
};

export default PatientDetails;
