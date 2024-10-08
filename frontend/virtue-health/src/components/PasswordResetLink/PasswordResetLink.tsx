import React from "react";
import { Link } from "react-router-dom";

const PasswordResetLink: React.FC = () => {
  return (
    <div>
      <p>
        Forgot your password? <Link to="/reset-password">Reset it here</Link>
      </p>
    </div>
  );
};

export default PasswordResetLink;
