import { Button, Card, Layout, Row, Col, theme } from "antd";
import React, { FC } from "react";
import { Outlet } from "react-router-dom";
import AppMenu from "../AppMenu/AppMenu";

const { Header, Content, Footer } = Layout;

const MainLayout: FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Header
        className="custom-component"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
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
          backgroundColor: colorBgContainer,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            padding: "24px",
            borderRadius: borderRadiusLG,
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: "center", background: "#f0f2f5" }}>
        Virtue Health ©2024
      </Footer>
    </Layout>
  );
};

export default MainLayout;
