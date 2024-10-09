import React from "react";
import { Form, Input, Button, message } from "antd";
import { registerDoctor } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const DoctorRegistration: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const response = await registerDoctor(values.email, values.password);
      message.success("Registration successful!");
      localStorage.setItem("refresh_token", response.refresh);
      localStorage.setItem("access_token", response.token);
      navigate("/login");
    } catch (error) {
      message.error("Registration failed. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", padding: "0 50px" }}>
      <h1>Doctor Registraion</h1>
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
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DoctorRegistration;
