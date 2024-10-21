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
  QuestionOutlined,
  HomeOutlined,
  VideoCameraOutlined,
  MailOutlined,
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
  { label: "Home", key: "/doctor-dashboard", icon: <HomeOutlined /> },
  { label: "Email", key: "", icon: <MailOutlined /> },
  { label: "Video Chat", key: "/appointments", icon: <VideoCameraOutlined /> },
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
  { label: "Home", key: "/patient-portal", icon: <HomeOutlined /> },
  {
    label: "Appointments",
    key: "/patient-portal/appointments",
    icon: <AppstoreOutlined />,
  },
  {
    label: "Doctors",
    key: "/patient-portal/doctor-list",
    icon: <ProfileOutlined />,
  },
  { label: "About", key: "/patient-portal/about", icon: <QuestionOutlined /> },
  {
    label: "My Profile",
    key: "SubMenu",
    icon: <SettingOutlined />,
    children: [
      {
        type: "group",
        label: "Profile Settings",
        children: [
          { label: "View My Profile", key: "/patient-portal/view-profile" },
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

// Helper function to determine if the current route matches a dynamic route like "/patient-portal/doctor/:id"
const isDoctorDetailsRoute = (route: string) =>
  /^\/patient-portal\/doctor-list\/doctor\/\d+$/.test(route);

// Function to get the proper menu items based on the current route
const getItemsForRoute = (route: string): MenuItem[] => {
  if (isDoctorDetailsRoute(route)) {
    return patientItems;
  }

  // Specific pages
  switch (route) {
    case "/doctor-dashboard":
    case "/doctor-dashboard/doctor-list":
    case "/doctor-dashboard/patient-list":
    case "/doctor-dashboard/view-profile":
    case "/doctor-dashboard/view-profile/edit-profile":
      return doctorItems;
    case "/patient-portal":
    case "/patient-portal/appointments":
    case "/patient-portal/doctor-list":
    case "/patient-portal/about":
    case "/patient-portal/view-profile":
    case "/patient-portal/view-profile/edit-profile":
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
