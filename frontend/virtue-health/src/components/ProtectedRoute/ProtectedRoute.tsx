import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getRoleFromToken } from "../../services/authService";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  const role = getRoleFromToken(token);

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
