import { Card, Col, Row } from "antd";
import React, { FC } from "react";
import VirtueHealthTitle from "../../assets/VirtueHealthTitle.png";
import HeroImgLeft from "../../assets/HeroImgLeft.jpg";
import HeroImgMiddle from "../../assets/HeroImgMiddle.jpg";
import HeroImgRight from "../../assets/HeroImgRight.jpg";

const cardStyle: React.CSSProperties = {
  maxWidth: 500,
  margin: "0 auto",
};

const imgStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 200,
  borderRadius: 10,
  margin: "0 auto",
  display: "block",
};

interface HomeProps {}

const Home: FC<HomeProps> = () => (
  <div>
    <Row gutter={[16, 16]} justify="start" align="middle">
      <Col>
        <h1 style={{ textAlign: "center", marginBottom: "0px" }}>Welcome to</h1>
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
            We are committed to providing a user-friendly and reliable platform
            that prioritizes your health and well-being. Our team of dedicated
            professionals works tirelessly to ensure that VirtueHealth meets the
            highest standards of security and privacy, so you can focus on what
            matters most—your health.
          </p>
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

export default Home;
