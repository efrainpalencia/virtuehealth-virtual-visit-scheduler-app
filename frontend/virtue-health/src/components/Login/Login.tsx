import React from "react";
import { Form, Input, Button, message } from "antd";
import { loginUser, getRoleFromToken } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import PasswordResetLink from "../PasswordResetLink/PasswordResetLink";

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      // Attempt to log in
      const response = await loginUser(values.email, values.password);

      // If login succeeds, store tokens
      localStorage.setItem("refresh_token", response.refresh);
      localStorage.setItem("access_token", response.access);

      // Navigate based on role
      const role = getRoleFromToken(response.access);
      switch (role) {
        case "DOCTOR":
          message.success("Login successful!");
          navigate("/doctor-dashboard");
          break;
        case "PATIENT":
          message.success("Login successful!");
          navigate("/patient-portal");
          break;
        case "ADMIN":
          message.success("Login successful!");
          navigate("/admin");
          break;
        default:
          message.error("Unrecognized role. Please contact support.");
      }
    } catch (error: any) {
      // Handle login errors or unexpected issues
      console.error("Error during login:", error);
      message.error(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        padding: "0 50px",
      }}
    >
      <h1>Login</h1>
      <Form
        form={form}
        onFinish={onFinish}
        style={{
          textAlign: "center",
          marginTop: "50px",
          padding: "0 240px",
        }}
      >
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
        </Form.Item>
      </Form>
      <PasswordResetLink />
    </div>
  );
};

export default Login;
