// LogoLink.tsx
import React from "react";
import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import VirtueLogo from "../../assets/VirtueLogo.png";

const LogoLink: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/patient-portal")}
      style={{ cursor: "pointer" }}
    >
      <Avatar size={50} src={<img src={VirtueLogo} alt="logo" />} />
    </div>
  );
};

export default LogoLink;
