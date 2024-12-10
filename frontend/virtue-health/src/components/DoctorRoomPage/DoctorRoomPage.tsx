import React, { useState } from "react";
import { createRoom } from "../../services/roomService";
import axios from "axios";
import { Form, Input, Button, notification, Typography, Space } from "antd";
import { EmailAPI } from "../../services/authService";

const { Title, Paragraph } = Typography;

const DoctorRoomPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [roomUrl, setRoomUrl] = useState("");

  const handleCreateRoom = async (values: { email: string }) => {
    setLoading(true);
    try {
      // Step 1: Create the room using the service
      const room = await createRoom();
      setRoomUrl(room.url);

      // Step 2: Notify the patient via backend
      await EmailAPI.post("/video/notify-patient/", {
        email: values.email,
        roomUrl: room.url,
      });

      // Step 3: Success notification
      notification.success({
        message: "Room Created",
        description: "The patient has been notified successfully.",
      });
    } catch (error) {
      console.error("Error creating room or notifying patient:", error);
      notification.error({
        message: "Room Creation Failed",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space
      direction="vertical"
      style={{ width: "100%", padding: "20px" }}
      align="center"
    >
      <Title level={2}>Create a Video Call Room</Title>
      <Paragraph>
        Enter the patient's email to send the video call link.
      </Paragraph>
      <Form
        onFinish={handleCreateRoom}
        layout="vertical"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <Form.Item
          name="email"
          label="Patient Email"
          rules={[
            { required: true, message: "Please enter the patient's email." },
            { type: "email", message: "Please enter a valid email address." },
          ]}
        >
          <Input placeholder="example@domain.com" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Room and Notify Patient
          </Button>
        </Form.Item>
      </Form>
      {roomUrl && (
        <Paragraph>
          <b>Room Created:</b>{" "}
          <a href={roomUrl} target="_blank" rel="noopener noreferrer">
            {roomUrl}
          </a>
        </Paragraph>
      )}
    </Space>
  );
};

export default DoctorRoomPage;
