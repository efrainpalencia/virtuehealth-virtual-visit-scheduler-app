import React, { useEffect, useState } from "react";
import {
  getPatientProfiles,
  PatientProfile,
} from "../../services/patientServices";

const PatientProfileList: React.FC = () => {
  const [profiles, setProfiles] = useState<PatientProfile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getPatientProfiles();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching patient profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div>
      <h1>Patient Profiles</h1>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.user.id}>
            {profile.user.first_name} {profile.user.last_name} - Age:
            {profile.user.date_of_birth
              ? new Date(profile.user.date_of_birth).toLocaleDateString()
              : "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientProfileList;
