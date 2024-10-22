import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Modal,
} from "antd";
import {
  getDoctorsMap,
  getDoctorProfilesMap,
} from "../../services/doctorService";
import VirtueLogo from "../../assets/VirtueLogo.png";
import { getRoleFromToken } from "../../services/authService";
import BookAppointment from "../BookAppointment/BookAppointment"; // Import the BookAppointment component

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
  const [isModalVisible, setIsModalVisible] = useState(false); // State to handle modal visibility

  const token = localStorage.getItem("access_token");
  const userRole = token ? getRoleFromToken(token) : null;

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

  const handleBookAppointmentClick = () => {
    setIsModalVisible(true); // Show the modal when the button is clicked
  };

  const handleModalCancel = () => {
    setIsModalVisible(false); // Hide the modal when canceled
  };

  // Create breadcrumb items based on the user role
  const breadcrumbItems = [
    {
      title: "Home",
    },
    {
      title:
        userRole === "DOCTOR" ? (
          <Link to="/doctor-dashboard/doctor-list">Doctor List</Link>
        ) : userRole === "PATIENT" ? (
          <Link to="/patient-portal/doctor-list">Doctor List</Link>
        ) : null,
    },
    {
      title: "Doctor Details",
    },
  ];

  return (
    <div>
      <Row style={{ paddingBottom: "48px" }}>
        <Breadcrumb items={breadcrumbItems.filter((item) => item.title)} />
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
            <Descriptions title="Doctor Info:" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={handleBookAppointmentClick}>
              Book Appointment
            </Button>
          </Col>
        </Row>
      </Card>

      {/* BookAppointment Modal */}
      <Modal
        title="Book an Appointment"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null} // Footer is omitted to handle buttons in the modal content
      >
        <BookAppointment doctor={doctor} onClose={handleModalCancel} />
      </Modal>
    </div>
  );
};

export default DoctorDetails;
