import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography } from "antd";
import axios from "axios";

const { Title } = Typography;

const PatientLogin: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/login/login/", {
        username,
        password,
      });
      if (response.data.user_type === "patient") {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        navigate("/patient_portal");
      } else {
        alert("You are not authorized to access this page.");
      }
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
      <Title level={2}>Patient Login</Title>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login as Patient
          </Button>
        </Form.Item>
        <Form.Item layout="horizontal">
          <Link
            style={{ marginLeft: "20px", marginRight: "40px" }}
            to="/register"
          >
            Create a New Account
          </Link>
          <Link
            style={{ marginLeft: "40px", marginRight: "10px" }}
            to="/password_reset"
          >
            Forgot Password?
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PatientLogin;
