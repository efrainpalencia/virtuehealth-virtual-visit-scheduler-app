import React, { useEffect, useState } from "react";
import { getDoctors, Doctor } from "../../services/doctorService";

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div>
      <h1>Doctors</h1>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor.id}>{doctor.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
