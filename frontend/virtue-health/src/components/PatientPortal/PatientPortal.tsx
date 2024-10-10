import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientList from "../PatientList/PatientList";

const PatientPortal: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Patient Portal</h1>
      <PatientList />
    </div>
  );
};

export default PatientPortal;
