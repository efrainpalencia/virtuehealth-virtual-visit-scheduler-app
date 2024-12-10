import React, { FC, useEffect, useState } from "react";
import {
  CalendarOutlined,
  CarryOutOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Flex, Layout, Menu, MenuProps, theme, message } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AppMenu from "../AppMenu/AppMenu";
import VirtueLogo from "../../assets/VirtueLogo.png";
import { getDoctor } from "../../services/doctorService";
import { getIdFromToken } from "../../services/authService";

const { Header, Sider, Content } = Layout;

interface DoctorDashboardLayoutProps {}

const DoctorDashboardLayout: FC<DoctorDashboardLayoutProps> = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [doctorName, setDoctorName] = useState<string | null>(null);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const siderBG = {
    background: "#0D54B1",
    color: "#ffffff",
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const doctorId = getIdFromToken(
          localStorage.getItem("access_token") || ""
        );
        if (!doctorId) {
          message.error("Doctor ID not found. Please log in again.");
          return;
        }

        const doctor = await getDoctor(Number(doctorId));
        if (doctor) {
          setDoctorName(`Dr. ${doctor.first_name} ${doctor.last_name}`);
        } else {
          message.error("Failed to load doctor details.");
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        message.error("An error occurred while fetching doctor details.");
      }
    };

    fetchDoctor();
  }, []);

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  return (
    <Layout>
      <Sider style={siderBG} trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px 0",
            color: "#ffffff",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {!collapsed && (
            <div style={{ color: "#ffffff", marginTop: 10 }}>
              {doctorName || "Doctor Name"}
            </div>
          )}
        </div>
        <Menu
          style={siderBG}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["/doctor-dashboard"]}
          onClick={onClick}
          items={[
            {
              key: "/doctor-dashboard",
              icon: <CarryOutOutlined />,
              label: "Dashboard",
            },
            {
              key: "/doctor-dashboard/doctor-schedule",
              icon: <CalendarOutlined />,
              label: "My Schedule",
            },
            {
              key: "/doctor-dashboard/patient-list",
              icon: <TeamOutlined />,
              label: "Patients",
            },
            {
              key: "/doctor-dashboard/doctor-list",
              icon: <TeamOutlined />,
              label: "Doctors",
            },
            {
              key: "/logout",
              icon: <LogoutOutlined />,
              label: "Log Out",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Flex>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <AppMenu route={window.location.pathname} />
          </Flex>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "100vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorDashboardLayout;
