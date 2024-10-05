import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import Login from "./components/Login/Login";
import PatientPortal from "./components/PatientPortal/PatientPortal";
import DoctorDashboard from "./components/DoctorDashboard/DoctorDashboard";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import DoctorRegistration from "./components/DoctorRegistration/DoctorRegistration";
import PatientRegistration from "./components/PatientRegistration/PatientRegistration";
import PasswordReset from "./components/PasswordReset/PasswordReset";
import "antd/dist/reset.css";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const userType = JSON.parse(localStorage.getItem("userType") || "[]");

  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Link to="/patient_login">Patient Login</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/doctor_login">Doctor Login</Link>
            </Menu.Item>
            <Menu.Item key="3">Contact</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <div className="site-layout-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register_doctor" element={<DoctorRegistration />} />
              <Route
                path="/register_patient"
                element={<PatientRegistration />}
              />
              <Route path="/password_reset" element={<PasswordReset />} />
              <Route
                path="/patient_portal"
                element={
                  <RequireAuth userType={userType} requiredType="Patients">
                    <PatientPortal />
                  </RequireAuth>
                }
              />
              <Route
                path="/doctor_dashboard"
                element={
                  <RequireAuth userType={userType} requiredType="Doctors">
                    <DoctorDashboard />
                  </RequireAuth>
                }
              />
              <Route path="/" element={<PatientLogin />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Virtue Health ©2024</Footer>
      </Layout>
    </Router>
  );
};

export default App;
