import React from "react";
import { useSearchParams } from "react-router-dom";
import VideoCallWrapper from "../VideoCallComponent/VideoCallComponent";
import { Spin, Typography } from "antd";

const { Title } = Typography;

const PatientRoomPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roomUrl = searchParams.get("room");

  if (!roomUrl) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Title level={2} type="danger">
          No Room URL Provided
        </Title>
        <p>Please check your email for the correct link.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin tip="Joining the room..." size="large">
        <VideoCallWrapper roomUrl={roomUrl} />
      </Spin>
    </div>
  );
};

export default PatientRoomPage;
