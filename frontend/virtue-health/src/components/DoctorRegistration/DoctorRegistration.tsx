import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

interface DoctorRegisterFormValues {
  email: string;
  password: string;
}

const DoctorRegister: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: DoctorRegisterFormValues) => {
    try {
      const response = await axios.post("/api/doctors/register/", values);
      message.success("Registration successful!");
      console.log(response.data);
    } catch (error) {
      message.error("Registration failed. Please try again.");
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
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DoctorRegister;
