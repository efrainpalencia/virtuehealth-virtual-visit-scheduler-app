import React, { useEffect, useState } from "react";
import { getPatients, Patient } from "../../services/patientService";

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div>
      <h1>Patients</h1>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>
            {patient.first_name} {patient.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientList;
