import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import axios from "axios";

const { Title } = Typography;

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const handlePasswordReset = async () => {
    try {
      await axios.post("/api/password_reset/", { email });
      alert("Password reset email sent! Please check your inbox.");
    } catch (error) {
      alert("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
      <Title level={2}>Reset Password</Title>
      <Form
        name="password_reset"
        initialValues={{ remember: true }}
        onFinish={handlePasswordReset}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PasswordReset;
