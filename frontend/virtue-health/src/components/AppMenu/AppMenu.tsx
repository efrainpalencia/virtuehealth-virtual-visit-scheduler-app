import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, Col, Flex, Menu, Row, Space } from "antd";
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
import LogoLink from "../Logolink/Logolink";

type MenuItem = {
  label: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
};

const doctorItems: MenuItem[] = [
  { label: "Home", key: "/doctor-dashboard", icon: <HomeOutlined /> },
  { label: "Email", key: "", icon: <MailOutlined /> },
  { label: "Video Chat", key: "/appointments", icon: <VideoCameraOutlined /> },
];

const patientItems: MenuItem[] = [
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
      { label: "View My Profile", key: "/patient-portal/view-profile" },
      {
        label: "View My Medical Records",
        key: "/patient-portal/medical-records",
      },
    ],
  },
  { label: "Logout", key: "/logout", icon: <LogoutOutlined /> },
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

const determineMenuItems = (route: string): MenuItem[] => {
  const doctorRoutes = [
    "/doctor-dashboard",
    "/doctor-dashboard/doctor-list",
    "/doctor-dashboard/patient-list",
    "/doctor-dashboard/view-profile",
    "/doctor-dashboard/view-profile/edit-profile",
    "/doctor-dashboard/doctor-schedule",
  ];

  const patientRoutes = [
    "/patient-portal",
    "/patient-portal/appointments",
    "/patient-portal/doctor-list",
    "/patient-portal/about",
    "/patient-portal/medical-records",
    "/patient-portal/view-medical-records/edit-medical-records",
    "/patient-portal/view-profile",
    "/patient-portal/view-profile/edit-profile",
  ];

  if (
    doctorRoutes.includes(route) ||
    /^\/doctor-dashboard\/patient-list\/patient\/\d+$/.test(route)
  ) {
    return doctorItems;
  }

  if (
    patientRoutes.includes(route) ||
    /^\/patient-portal\/doctor-list\/doctor\/\d+$/.test(route)
  ) {
    return patientItems;
  }

  return loggedOutItems;
};

// Helper functions to determine the current route type
const isPatientRoute = (route: string) => route.startsWith("/patient-portal");
const isDoctorRoute = (route: string) => route.startsWith("/doctor-dashboard");

const AppMenu: React.FC<{ route: string }> = ({ route }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = React.useState<MenuItem[]>(
    determineMenuItems(route)
  );

  useEffect(() => {
    setItems(determineMenuItems(location.pathname));
  }, [location.pathname]);

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "/logout") {
      logoutUser();
      navigate("/login");
    } else {
      navigate(e.key);
    }
  };

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <Row>
        <Col span={8}>{isPatientRoute(location.pathname) && <LogoLink />}</Col>
        <Col span={16}>
          <Menu
            onClick={onClick}
            mode="horizontal"
            items={items}
            selectedKeys={[location.pathname]}
          />
        </Col>
      </Row>
    </div>
  );
};

export default AppMenu;
