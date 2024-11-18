import React, { useState } from "react";
import { Input, Button, message } from "antd";
import axios from "axios";

const PasswordResetLink: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendResetLink = async () => {
    if (!email) {
      message.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/auth/reset_password", { email });
      message.success("Password reset link sent to your email!");
      setEmail(""); // Clear the input field after success
    } catch (error) {
      message.error(
        error.response?.data?.error ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Forgot your password?</h3>
      <Input
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "300px", marginBottom: "10px" }}
      />
      <Button type="primary" onClick={handleSendResetLink} loading={loading}>
        Send Reset Link
      </Button>
    </div>
  );
};

export default PasswordResetLink;
