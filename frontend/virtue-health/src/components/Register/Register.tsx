import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Radio } from "antd";
import axios from "axios";

const { Title } = Typography;

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userType, setUserType] = useState<string>("patient");
  const [oneTimeCode, setOneTimeCode] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("/api/register/", {
        username,
        password,
        email,
        user_type: userType,
        one_time_code: oneTimeCode,
      });
      alert("Registration successful! Please log in.");
      navigate("/patient_login");
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
      <Title level={2}>Register New User</Title>
      <Form
        name="register"
        initialValues={{ remember: true }}
        onFinish={handleRegister}
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
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <Form.Item
          name="user_type"
          rules={[{ required: true, message: "Please select your user type!" }]}
        >
          <Radio.Group
            onChange={(e) => setUserType(e.target.value)}
            value={userType}
          >
            <Radio value="patient">Patient</Radio>
            <Radio value="doctor">Doctor</Radio>
          </Radio.Group>
        </Form.Item>
        {userType === "doctor" && (
          <Form.Item
            name="one_time_code"
            rules={[
              { required: true, message: "Please input the one-time code!" },
            ]}
          >
            <Input
              placeholder="One-Time Code"
              value={oneTimeCode}
              onChange={(e) => setOneTimeCode(e.target.value)}
            />
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
