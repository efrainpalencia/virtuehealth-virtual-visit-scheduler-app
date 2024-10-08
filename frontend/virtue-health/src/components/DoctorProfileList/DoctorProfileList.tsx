import React, { useEffect, useState } from "react";
import { getDoctorProfiles, DoctorProfile } from "../../services/doctorService";

const DoctorProfileList: React.FC = () => {
  const [profiles, setProfiles] = useState<DoctorProfile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getDoctorProfiles();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching doctor profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div>
      <h1>Doctor Profiles</h1>
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

export default DoctorProfileList;
