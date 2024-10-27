import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import PatientPortal from "./components/PatientPortal/PatientPortal";
import DoctorDashboard from "./components/DoctorDashboard/DoctorDashboard";
import DoctorRegistration from "./components/DoctorRegistration/DoctorRegistration";
import PatientRegistration from "./components/PatientRegistration/PatientRegistration";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PasswordResetRequestForm from "./components/PasswordResetRequestForm/PasswordResetRequestForm";
import PasswordResetForm from "./components/PasswordResetForm/PasswordResetForm";
import LogoutPage from "./components/LogoutPage/LogoutPage";
import PatientProfileForm from "./components/PatientProfileForm/PatientProfileForm";
import PatientProfileCard from "./components/PatientProfileCard/PatientProfileCard";
import DoctorList from "./components/DoctorList/DoctorList";
import DoctorDetails from "./components/DoctorDetails/DoctorDetails";
import MainLayout from "./components/MainLayout/MainLayout";
import DoctorDashboardLayout from "./components/DoctorDashboardLayout/DoctorDashboardLayout";
import PatientPortalLayout from "./components/PatientPortalLayout/PatientPortalLayout";
import "./theme.less";
import PatientList from "./components/PatientList/PatientList";
import DoctorProfileCard from "./components/DoctorProfileCard/DoctorProfileCard";
import DoctorProfileForm from "./components/DoctorProfileForm/DoctorProfileForm";
import PatientDetails from "./components/PatientDetails/PatientDetails";
import DoctorSchedule from "./components/DoctorSchedule/DoctorSchedule";
import AppointmentForm from "./components/AppointmentForm/AppointmentForm";
import PatientAppointments from "./components/PatientAppointments/PatientAppointments";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<LogoutPage />} />
          <Route path="register/patient" element={<PatientRegistration />} />
          <Route path="register/doctor" element={<DoctorRegistration />} />
          <Route path="reset-password" element={<PasswordResetRequestForm />} />
          <Route
            path="reset-password-confirm"
            element={<PasswordResetForm />}
          />
        </Route>

        {/* Doctor Dashboard Layout Routes */}
        <Route element={<ProtectedRoute allowedRoles={["DOCTOR"]} />}>
          <Route path="/doctor-dashboard" element={<DoctorDashboardLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="doctor-list" element={<DoctorList />} />
            <Route path="doctor-list/doctor/:id" element={<DoctorDetails />} />
            <Route path="patient-list" element={<PatientList />} />
            <Route path="doctor-schedule" element={<DoctorSchedule />} />
            <Route
              path="patient-list/patient/:id"
              element={<PatientDetails />}
            />
            <Route path="view-profile" element={<DoctorProfileCard />} />
            <Route
              path="view-profile/edit-profile"
              element={<DoctorProfileForm />}
            />
            <Route path="logout" element={<LogoutPage />} />
          </Route>
        </Route>

        {/* Patient Portal Layout Routes */}
        <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
          <Route path="/patient-portal" element={<PatientPortalLayout />}>
            <Route index element={<PatientPortal />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="doctor-list" element={<DoctorList />} />
            <Route path="doctor-list/doctor/:id" element={<DoctorDetails />} />
            <Route
              path="/patient-portal/doctor-list/doctor/:id/appointment-form"
              element={<AppointmentForm doctor={undefined} selectedDate={""} />}
            />
            <Route path="view-profile" element={<PatientProfileCard />} />
            <Route
              path="view-profile/edit-profile"
              element={<PatientProfileForm />}
            />
          </Route>
        </Route>

        {/* Uncomment and configure when ready */}
        {/* 
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="admin-dashboard" element={<AdminDashboardLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route> 
        */}
      </Routes>
    </Router>
  );
};

export default App;
