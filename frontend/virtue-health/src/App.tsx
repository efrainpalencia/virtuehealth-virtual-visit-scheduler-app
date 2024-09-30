import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import DoctorLogin from "./components/DoctorLogin/DoctorLogin";
import PatientLogin from "./components/PatientLogin/PatientLogin";
import PatientPortal from "./components/PatientPortal/PatientPortal";
import DoctorDashboard from "./components/DoctorDashboard/DoctorDashboard";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import Register from "./components/Register/Register";
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
              <Route path="/doctor_login" element={<DoctorLogin />} />
              <Route path="/patient_login" element={<PatientLogin />} />
              <Route path="/register" element={<Register />} />
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
