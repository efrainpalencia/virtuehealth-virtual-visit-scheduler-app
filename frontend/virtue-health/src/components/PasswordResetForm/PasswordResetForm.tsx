import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";

const PasswordResetForm: React.FC = () => {
  const [form] = Form.useForm();
  const search = useLocation().search;
  const uid = new URLSearchParams(search).get("uid");
  const token = new URLSearchParams(search).get("token");

  const onFinish = async (values: { new_password: string }) => {
    try {
      await axios.post("/api/auth/reset_password_confirm", {
        uid,
        token,
        new_password: values.new_password,
      });
      message.success("Password updated successfully!");
    } catch (error) {
      if (error.response?.status === 400) {
        message.error("Invalid or expired token.");
      } else {
        message.error("Failed to reset password. Please try again.");
      }
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="new_password"
        rules={[
          { required: true, message: "Please input your new password!" },
          { min: 8, message: "Password must be at least 8 characters!" },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message: "Password must contain letters and numbers!",
          },
        ]}
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
