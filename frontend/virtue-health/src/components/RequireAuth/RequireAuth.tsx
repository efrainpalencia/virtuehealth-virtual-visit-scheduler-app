import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface RequireAuthProps {
  children: JSX.Element;
  userGroups: string[];
  requiredGroup: string;
}

const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  userGroups,
  requiredGroup,
}) => {
  const location = useLocation();

  if (!userGroups.includes(requiredGroup)) {
    // Redirect them to the login page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
