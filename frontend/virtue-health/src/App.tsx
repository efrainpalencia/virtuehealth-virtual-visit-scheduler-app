import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import PatientPortal from "./components/PatientPortal/PatientPortal";
import DoctorDashboard from "./components/DoctorDashboard/DoctorDashboard";
import DoctorRegistration from "./components/DoctorRegistration/DoctorRegistration";
import PatientRegistration from "./components/PatientRegistration/PatientRegistration";
import PasswordReset from "./components/PasswordReset/PasswordReset";
import AppMenu from "./components/AppMenu/AppMenu";
import PatientList from "./components/PatientList/PatientList";
import PatientProfileList from "./components/PatientProfileList/PatientProfileList";
import { Layout } from "antd";
import "antd/dist/reset.css";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import LogoutButton from "./components/LogoutButton/LogoutButton";
import PasswordResetRequestForm from "./components/PasswordResetRequestForm/PasswordResetRequestForm";
import PasswordResetForm from "./components/PasswordResetForm/PasswordResetForm";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <AppMenu />
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <div className="site-layout-content">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/register/patient/"
                element={<PatientRegistration />}
              />
              <Route
                path="/register/doctor/"
                element={<DoctorRegistration />}
              />
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
                <Route path="patient" element={<PatientList />} />
              </Route>

              <Route
                path="/"
                element={<ProtectedRoute allowedRoles={["DOCTOR"]} />}
              >
                <Route path="doctor-dashboard" element={<DoctorDashboard />} />
              </Route>

              {/* <Route
                path="/"
                element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
              >
                 <Route path="admin-dashboard" element={<AdminDashboard />} />
              </Route>

              <Route path="/unauthorized" element={<Unauthorized />} /> */}
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Virtue Health ©2024</Footer>
      </Layout>
    </Router>
  );
};

export default App;
