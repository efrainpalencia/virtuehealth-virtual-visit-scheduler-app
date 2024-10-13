import React from "react";
import { Button, Card, Col, Divider, Flex, Row, Space } from "antd";
import VirtueHealthTitle from "../../assets/VirtueHealthTitle.png";
import HeroImgLeft from "../../assets/HeroImgLeft.jpg";
import HeroImgMiddle from "../../assets/HeroImgMiddle.jpg";
import HeroImgRight from "../../assets/HeroImgRight.jpg";
import SearchBar from "../SearchBar/SearchBar";

const style: React.CSSProperties = { background: "#0092ff", padding: "8px 0" };

const cardStyle: React.CSSProperties = {
  width: 500,
};

const imgStyle: React.CSSProperties = {
  maxWidth: 200,
  padding: 5,
  borderRadius: 10,
};

const PatientPortal: React.FC = () => {
  return (
    <div>
      <Flex
        wrap
        gap="large"
        align="flex-start"
        justify="space-between"
        style={{ padding: 10 }}
      >
        <Flex vertical align="center">
          <div>
            <img src={VirtueHealthTitle} alt="Title" />
          </div>
          <Card
            title="Book A Virtual Health Visit"
            bordered={true}
            hoverable
            style={cardStyle}
          >
            <div>
              <p>
                We are committed to providing a user-friendly and reliable
                platform that prioritizes your health and well-being. Our team
                of dedicated professionals works tirelessly to ensure that
                VirtueHealth meets the highest standards of security and
                privacy, so you can focus on what matters most—your health.
              </p>
              <Button type="primary" href="https://ant.design" target="_blank">
                Learn More
              </Button>
            </div>
          </Card>
        </Flex>
        <Flex
          align="flex-start"
          justify="space-between"
          style={{ paddingTop: "100px" }}
        >
          <Space>
            <img style={imgStyle} src={HeroImgLeft} alt="" />
            <img style={imgStyle} src={HeroImgMiddle} alt="" />
            <img style={imgStyle} src={HeroImgRight} alt="" />
          </Space>
        </Flex>
      </Flex>
      <div></div>

      <Divider orientation="center">
        <h2>Search For Doctors</h2>
        <Space>
          <SearchBar />
        </Space>
      </Divider>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={6}>
          <div style={style}>col-6</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={style}>col-6</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={style}>col-6</div>
        </Col>
      </Row>
    </div>
  );
};

export default PatientPortal;
