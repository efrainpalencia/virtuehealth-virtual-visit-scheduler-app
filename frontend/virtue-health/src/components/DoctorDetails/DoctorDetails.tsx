import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Modal,
  message,
} from "antd";
import {
  getDoctorsMap,
  getDoctorProfilesMap,
} from "../../services/doctorService";
import VirtueLogo from "../../assets/VirtueLogo.png";
import { getRoleFromToken } from "../../services/authService";
import BookAppointment from "../BookAppointment/BookAppointment";
import { Dayjs } from "dayjs";

const specialtyMap = {
  GENERAL_DOCTOR: "General Doctor",
  CARDIOLOGIST: "Cardiologist",
  ORTHOPEDIST: "Orthopedist",
  NEUROLOGIST: "Neurologist",
  PSYCHIATRIST: "Psychiatrist",
  PEDIATRICIAN: "Pediatrician",
};

const DoctorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

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

  const imgSrc = doctor?.img_url || VirtueLogo;

  const handleBookAppointmentClick = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Navigate to AppointmentForm with doctor data and selected date
  const handleDateSelect = (selectedDateTime: Dayjs) => {
    setIsModalVisible(false);
    if (selectedDateTime) {
      navigate(`/patient-portal/doctor-list/doctor/${id}/appointment-form`, {
        state: { doctor, selectedDate: selectedDateTime.toISOString() },
      });
    } else {
      message.error("Please select a date to proceed.");
    }
  };

  const breadcrumbItems = [
    { title: "Home" },
    {
      title:
        userRole === "DOCTOR" ? (
          <Link to="/doctor-dashboard/doctor-list">Doctor List</Link>
        ) : userRole === "PATIENT" ? (
          <Link to="/patient-portal/doctor-list">Doctor List</Link>
        ) : null,
    },
    { title: "Doctor Details" },
  ];

  return (
    <div>
      <Row style={{ paddingBottom: "48px" }}>
        <Breadcrumb items={breadcrumbItems.filter((item) => item.title)} />
      </Row>
      <Card
        title="Doctor Details"
        style={{ textAlign: "start", marginTop: "10px" }}
      >
        <Row>
          <Col span={8}>
            <h1>
              Dr. {doctor.last_name}, {doctor.first_name}
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

      <Modal
        title="Book an Appointment"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <BookAppointment
          doctor={doctor}
          onClose={handleModalCancel}
          onDateSelect={handleDateSelect} // Pass handleDateSelect
        />
      </Modal>
    </div>
  );
};

export default DoctorDetails;
