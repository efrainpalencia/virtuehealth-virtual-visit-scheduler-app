import React from "react";
import "./theme.less";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import PatientPortal from "./components/PatientPortal/PatientPortal";
import DoctorDashboard from "./components/DoctorDashboard/DoctorDashboard";
import DoctorRegistration from "./components/DoctorRegistration/DoctorRegistration";
import PatientRegistration from "./components/PatientRegistration/PatientRegistration";
import { Layout, theme } from "antd";
import "antd/dist/reset.css";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PasswordResetRequestForm from "./components/PasswordResetRequestForm/PasswordResetRequestForm";
import PasswordResetForm from "./components/PasswordResetForm/PasswordResetForm";
import AppMenu from "./components/AppMenu/AppMenu";
import LogoutPage from "./components/LogoutPage/LogoutPage";
import PatientProfileForm from "./components/PatientProfileForm/PatientProfileForm";
import PatientProfileView from "./components/PatientProfileView/PatientProfileView";
import PatientProfileCard from "./components/PatientProfileCard/PatientProfileCard";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="layout">
      <Router>
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
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route
                path="/register/patient"
                element={<PatientRegistration />}
              />
              <Route path="/register/doctor" element={<DoctorRegistration />} />
              <Route
                path="/reset-password"
                element={<PasswordResetRequestForm />}
              />
              <Route
                path="/reset-password-confirm"
                element={<PasswordResetForm />}
              />

              <Route
                path="/"
                element={<ProtectedRoute allowedRoles={["PATIENT"]} />}
              >
                <Route path="patient-portal" element={<PatientPortal />} />
                <Route path="view-profile" element={<PatientProfileCard />} />
                <Route path="edit-profile" element={<PatientProfileForm />} />
              </Route>

              <Route
                path="/"
                element={<ProtectedRoute allowedRoles={["DOCTOR"]} />}
              >
                <Route path="doctor-dashboard" element={<DoctorDashboard />} />
              </Route>

              {/* Uncomment and configure when ready */}
              {/* <Route path="/" element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                 <Route path="admin-dashboard" element={<AdminDashboard />} />
              </Route>
              <Route path="/unauthorized" element={<Unauthorized />} /> */}
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Virtue Health ©2024</Footer>
      </Router>
    </Layout>
  );
};

export default App;
