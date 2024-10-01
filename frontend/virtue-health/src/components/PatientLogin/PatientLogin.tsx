import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography } from "antd";
import AuthService from "../../services/AuthService";

const { Title } = Typography;

const PatientLogin: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await AuthService.login(username, password);
      if (response.user_type === "patient") {
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
          rules={[
            { required: true, message: "Please input your username!" },
            { max: 150, message: "Username must be 150 characters or fewer" },
            {
              pattern: /^[\w.@+-]+$/,
              message:
                "Username can only contain letters, digits, and @/./+/-/_ characters",
            },
          ]}
        >
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 8, message: "Password must be at least 8 characters long" },
          ]}
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
