import React from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

const items = [
  {
    label: "Login",
    key: "/login",
  },
  {
    label: "Doctor Registration",
    key: "/register_doctor",
  },
  {
    label: "Patient Registration",
    key: "register_patient",
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
