import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useHistory } from "react-router-dom";
import AuthService from "./AuthService"; // Make sure to import your AuthService

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const history = useHistory();

  const onFinish = async (values: LoginFormValues) => {
    try {
      await AuthService.login(values.email, values.password);
      message.success("Login successful!");
      // Redirect based on user type after successful login
      const userType = await AuthService.getUserType(); // Fetch user type from API or decode from token
      if (userType === "doctor") {
        history.push("/doctor-dashboard");
      } else if (userType === "patient") {
        history.push("/patient-dashboard");
      }
    } catch (error) {
      message.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
