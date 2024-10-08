import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const PasswordResetRequestForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string }) => {
    try {
      await axios.post("/api/auth/reset-password/", { email: values.email });
      message.success("Password reset email sent!");
    } catch (error) {
      message.error("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "Please enter a valid email address!",
          },
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Send Reset Email
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PasswordResetRequestForm;
