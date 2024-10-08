import React from "react";
import { Menu } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import LogoutButton from "../LogoutButton/LogoutButton";
import { logoutUser } from "../../services/authService";

const items = [
  {
    label: "Login",
    key: "/login",
  },
  {
    label: "Doctor Registration",
    key: "/register/doctor",
  },
  {
    label: "Patient Registration",
    key: "register/patient",
  },
];

const AppMenu: React.FC = () => {
  const navigate = useNavigate();

  const onClick = (e: unknown) => {
    navigate(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      items={items}
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={["/login"]}
    />
  );
};

export default AppMenu;
