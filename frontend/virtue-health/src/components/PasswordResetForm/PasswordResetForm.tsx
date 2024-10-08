import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";

const PasswordResetForm: React.FC = () => {
  const [form] = Form.useForm();
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token");
  const email = new URLSearchParams(search).get("email");

  const onFinish = async (values: { new_password: string }) => {
    try {
      await axios.post("/api/auth/reset-password-confirm/", {
        token,
        email,
        new_password: values.new_password,
      });
      message.success("Password updated successfully!");
    } catch (error) {
      message.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="new_password"
        rules={[{ required: true, message: "Please input your new password!" }]}
      >
        <Input.Password placeholder="New Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PasswordResetForm;
