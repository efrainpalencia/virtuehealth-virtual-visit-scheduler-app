import { Flex, Layout, theme } from "antd";
import React, { FC } from "react";
import { Outlet } from "react-router-dom";
import AppMenu from "../AppMenu/AppMenu";

const { Header, Content, Footer } = Layout;

interface PatientPortalLayoutProps {}

const PatientPortalLayout: FC<PatientPortalLayoutProps> = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="layout">
      <Header
        className="custom-component"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div className="demo-logo" />
        <AppMenu route={window.location.pathname} />
      </Header>
      <Content style={{ padding: "0 48px" }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: "100vh",
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Flex align="center">
            <div>
              <Outlet />
            </div>
          </Flex>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>Virtue Health ©2024</Footer>
    </Layout>
  );
};

export default PatientPortalLayout;
