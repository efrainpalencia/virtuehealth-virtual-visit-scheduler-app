import React from "react";
import { Form, Input, Button, message, Link } from "antd";
import { loginUser, getRoleFromToken } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import PasswordResetLink from "../PasswordResetLink/PasswordResetLink";

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const response = await loginUser(values.email, values.password);
      message.success("Login successful!");
      localStorage.setItem("refresh_token", response.refresh);
      localStorage.setItem("access_token", response.access);

      const role = getRoleFromToken(response.access);
      console.log("User role:", role);

      if (role === "DOCTOR") {
        navigate("/doctor-dashboard");
        console.log("Navigating to /doctor-dashboard");
      } else if (role === "PATIENT") {
        navigate("/patient-portal");
        console.log("Navigating to /patient-portal");
      } else if (role === "ADMIN") {
        navigate("/admin");
        console.log("Navigating to /admin");
      }
    } catch (error) {
      message.error(
        "Login failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", padding: "0 50px" }}>
      <h1>Login</h1>
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
          <Form.Item>
            <PasswordResetLink />
          </Form.Item>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
