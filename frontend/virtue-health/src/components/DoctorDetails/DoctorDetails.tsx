import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Modal,
  message,
  DescriptionsProps,
} from "antd";
import {
  getDoctorsMap,
  getDoctorProfilesMap,
} from "../../services/doctorService";
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

const insuranceDisclaimer =
  "Most insurances are accepted by physicians on staff. You should contact the office for questions about financial arrangements and insurance acceptance.";

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

  const contactItems: DescriptionsProps["items"] = [
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
      children: `${insuranceDisclaimer}` || "Not provided",
    },
  ];

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
          <Col span={16}>
            <h1>
              Dr. {doctor.last_name}, {doctor.first_name}
            </h1>
            <h2>{specialtyMap[doctor.specialty]}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Descriptions
              title="Doctor Info:"
              items={contactItems}
              style={{ justifyContent: "center" }}
            />
          </Col>
        </Row>
        <Row>
          <Col
            span={12}
            style={{ justifyContent: "center", paddingTop: "25px" }}
          >
            <Button type="primary" onClick={handleBookAppointmentClick}>
              Book Appointment
            </Button>
          </Col>
        </Row>
      </Card>
      <Card
        title={`About Dr. ${doctor.first_name} ${doctor.last_name}`}
        style={{ textAlign: "start", marginTop: "10px" }}
      >
        <Row>
          <Col>
            <Descriptions
              title="Education:"
              items={aboutItems}
              style={{ justifyContent: "center" }}
            />
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
