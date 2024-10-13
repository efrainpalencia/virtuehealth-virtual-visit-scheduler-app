import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, Menu, Space } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  ProfileOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { logoutUser } from "../../services/authService";
import VirtueLogo from "../../assets/VirtueLogo.png";

type MenuItem = {
  label: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: MenuItem[];
};

// Define the menu items for different roles
const doctorItems: MenuItem[] = [
  { label: "Patient List", key: "/patient-list", icon: <UserOutlined /> },
  { label: "Appointments", key: "/appointments", icon: <AppstoreOutlined /> },
  { label: "Prescriptions", key: "/prescriptions", icon: <ProfileOutlined /> },
  { label: "Reports", key: "/reports", icon: <SettingOutlined /> },
  { label: "Logout", key: "/logout", icon: <LogoutOutlined /> },
];

const patientItems: MenuItem[] = [
  {
    label: "",
    key: "/patient-portal",
    icon: (
      <Space size={15} wrap>
        <Avatar size={50} src={<img src={VirtueLogo} alt="logo" />} />
      </Space>
    ),
  },
  { label: "Home", key: "/patient-portal", icon: <UserOutlined /> },
  { label: "Appointments", key: "/appointments", icon: <AppstoreOutlined /> },
  { label: "Prescriptions", key: "/prescriptions", icon: <ProfileOutlined /> },
  { label: "Invoices", key: "/invoices", icon: <SettingOutlined /> },
  {
    label: "My Profile",
    key: "SubMenu",
    icon: <SettingOutlined />,
    children: [
      {
        type: "group",
        label: "Profile Settings",
        children: [
          { label: "View My Profile", key: "view-profile" },
          { label: "Logout", key: "/logout", icon: <LogoutOutlined /> },
        ],
      },
    ],
  },
];

const loggedOutItems: MenuItem[] = [
  { label: "Login", key: "/login", icon: <LoginOutlined /> },
  {
    label: "Patient Registration",
    key: "/register/patient",
    icon: <UserOutlined />,
  },
  {
    label: "Doctor Registration",
    key: "/register/doctor",
    icon: <UserOutlined />,
  },
];

const getItemsForRoute = (route: string): MenuItem[] => {
  switch (route) {
    case "/doctor-dashboard":
      return doctorItems;
    case "/patient-portal":
      return patientItems;
    case "/view-profile":
      return patientItems;
      return patientItems;
    case "/edit-profile":
      return patientItems;
    default:
      return loggedOutItems;
  }
};

// Menu component
const AppMenu: React.FC<{ route: string }> = ({ route }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = React.useState(getItemsForRoute(route));

  useEffect(() => {
    setItems(getItemsForRoute(location.pathname));
  }, [location.pathname]);

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "/logout") {
      // Add logout logic, like clearing tokens or session data
      logoutUser();
      navigate(e.key);
    } else {
      navigate(e.key);
    }
  };

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <Menu
        onClick={onClick}
        mode="horizontal"
        items={items}
        selectedKeys={[location.pathname]}
      />
    </div>
  );
};

export default AppMenu;
