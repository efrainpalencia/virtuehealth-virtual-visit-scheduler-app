import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface RequireAuthProps {
  children: JSX.Element;
  userType: string;
  requiredUserType: string;
}

const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  userType,
  requiredUserType,
}) => {
  const location = useLocation();

  if (userType !== requiredUserType) {
    // Redirect them to the login page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
