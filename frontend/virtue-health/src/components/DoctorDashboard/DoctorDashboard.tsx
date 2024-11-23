import React from "react";
import DoctorAppointments from "../DoctorAppointments/DoctorAppointments";
import { Row, Col, Typography } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

const DoctorDashboard: React.FC = () => {
  const currentDate = dayjs().format("MMMM DD, YYYY"); // Format the current date

  return (
    <div>
      <Row justify="center" style={{ marginBottom: "20px" }}>
        <Col>
          <Title level={3}>Doctor Dashboard</Title>
          <Title level={4} style={{ marginTop: 0 }}>
            {currentDate}
          </Title>
        </Col>
      </Row>
      <DoctorAppointments />
    </div>
  );
};

export default DoctorDashboard;
