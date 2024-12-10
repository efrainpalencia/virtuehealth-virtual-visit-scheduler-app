import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", padding: "0 50px" }}>
      <h2>You have successfully logged out!</h2>
      <Button type="primary" onClick={handleLoginRedirect}>
        Log Back In
      </Button>
    </div>
  );
};

export default LogoutPage;
