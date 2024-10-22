import React, { FC, useState } from "react";
import {
  CalendarOutlined,
  CarryOutOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Flex, Layout, Menu, MenuProps, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AppMenu from "../AppMenu/AppMenu";
import VirtueLogo from "../../assets/VirtueLogo.png";

const { Header, Sider, Content } = Layout;

interface DoctorDashboardLayoutProps {}

const DoctorDashboardLayout: FC<DoctorDashboardLayoutProps> = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const siderBG = {
    background: "#0D54B1",
    color: "#ffffff",
  };

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  const imgSrc = VirtueLogo;

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
          <Link to="view-profile">
            <Avatar src={VirtueLogo} size={collapsed ? 40 : 80} />
          </Link>
          {!collapsed && (
            <>
              <div style={{ color: "#ffffff", marginTop: 10 }}>
                Dr. John Doe
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Cardiologist
              </div>
            </>
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
              key: "2",
              icon: <CalendarOutlined />,
              label: "Schedule Calender",
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
