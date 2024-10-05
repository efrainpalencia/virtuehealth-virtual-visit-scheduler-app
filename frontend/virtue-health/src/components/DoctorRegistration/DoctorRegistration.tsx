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
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "The input is not valid E-mail!" },
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

export default DoctorRegister;
