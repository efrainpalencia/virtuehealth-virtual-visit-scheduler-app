import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <Button type="primary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
