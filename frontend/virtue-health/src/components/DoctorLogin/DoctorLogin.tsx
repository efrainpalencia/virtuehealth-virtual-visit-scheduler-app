import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorLogin: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/login/login/", {
        username,
        password,
      });
      if (response.data.user_type === "doctor") {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        navigate("/doctor_dashboard");
      } else {
        alert("You are not authorized to access this page.");
      }
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Doctor Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login as Doctor</button>
    </div>
  );
};

export default DoctorLogin;
