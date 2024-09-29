import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout, Menu } from "antd";
import Login from "./components/Login/Login";
import PatientPortal from "./components/PatientPortal/PatientPortal";
import DoctorDashboard from "./components/DoctorDashboard/DoctorDashboard";
import "antd/dist/reset.css";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">Home</Menu.Item>
            <Menu.Item key="2">Doctors</Menu.Item>
            <Menu.Item key="3">Login</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <div
            className="site-layout-content"
            style={{ padding: "24px", minHeight: "280px" }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/patient_portal" element={<PatientPortal />} />
              <Route path="/doctor_dashboard" element={<DoctorDashboard />} />
              <Route path="/" element={<Login />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Virtue Health ©2024</Footer>
      </Layout>
    </Router>
  );
};

export default App;
