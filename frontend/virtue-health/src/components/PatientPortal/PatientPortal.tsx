import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button, Card, Col, Divider, Flex, Row, Space } from "antd";
import VirtueHealthTitle from "../../assets/VirtueHealthTitle.png";
import HeroImgLeft from "../../assets/HeroImgLeft.jpg";
import HeroImgMiddle from "../../assets/HeroImgMiddle.jpg";
import HeroImgRight from "../../assets/HeroImgRight.jpg";
import SearchBar from "../SearchBar/SearchBar";

const style: React.CSSProperties = { background: "#0D54B1", padding: "8px 0" };

const cardStyle: React.CSSProperties = {
  width: 500,
};

const imgStyle: React.CSSProperties = {
  maxWidth: 200,
  padding: 5,
  borderRadius: 10,
};

const PatientPortal: React.FC = () => {
  const navigate = useNavigate();

  const handleHandleFindDoctor = () => {
    navigate("/patient-portal/doctor-list");
  };

  return (
    <div>
      <Row gutter={[16, 16]} justify="start" align="middle">
        <Col>
          <h1 style={{ textAlign: "center", marginBottom: "0px" }}>
            Welcome to
          </h1>
        </Col>
      </Row>
      <Row gutter={[16, 16]} justify="start" align="middle">
        <Col>
          <img
            src={VirtueHealthTitle}
            alt="Virtue Health Title"
            style={{ maxWidth: "300px", display: "block" }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} justify="center" align="middle">
        <Col>
          <Card
            title="Book A Virtual Health Visit"
            bordered={true}
            style={cardStyle}
          >
            <p>
              We are committed to providing a user-friendly and reliable
              platform that prioritizes your health and well-being. Our team of
              dedicated professionals works tirelessly to ensure that
              VirtueHealth meets the highest standards of security and privacy,
              so you can focus on what matters most—your health.
            </p>
            <Button type="primary" onClick={handleHandleFindDoctor}>
              Find A Doctor
            </Button>
          </Card>
        </Col>
        <Col>
          <img style={imgStyle} src={HeroImgLeft} alt="Hero Left" />
        </Col>
        <Col>
          <img style={imgStyle} src={HeroImgMiddle} alt="Hero Middle" />
        </Col>
        <Col>
          <img style={imgStyle} src={HeroImgRight} alt="Hero Right" />
        </Col>
      </Row>
      <Row
        gutter={[24, 24]}
        justify="center"
        align="middle"
        style={{ marginTop: "50px" }}
      ></Row>
    </div>
  );
};

export default PatientPortal;
