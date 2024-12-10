import { Layout, theme } from "antd";
import React, { FC } from "react";
import { Outlet } from "react-router-dom";
import AppMenu from "../AppMenu/AppMenu";

const { Header, Content, Footer } = Layout;

const PatientPortalLayout: FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="layout">
      <Header
        className="custom-component"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="demo-logo" />
        <AppMenu route={window.location.pathname} />
      </Header>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
          minHeight: "100vh",
          backgroundColor: colorBgContainer,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            padding: "24px",
            borderRadius: borderRadiusLG,
            backgroundColor: "#ffffff", // Ensures a consistent background
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Optional for aesthetic
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>Virtue Health ©2024</Footer>
    </Layout>
  );
};

export default PatientPortalLayout;
