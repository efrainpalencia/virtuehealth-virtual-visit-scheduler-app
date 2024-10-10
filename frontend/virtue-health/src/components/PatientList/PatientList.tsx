import React, { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import {
  getPatients,
  Patient,
  getPatientProfiles,
  PatientProfile,
} from "../../services/patientService"; // Adjust the import path based on your structure

interface PatientMap {
  [key: number]: Patient;
}

interface PatientProfileMap {
  [key: number]: PatientProfile;
}

const PatientList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [patientsMap, setPatientsMap] = useState<PatientMap>({}); // Hash map for patients
  const [patientProfilesMap, setPatientProfilesMap] =
    useState<PatientProfileMap>({}); // Hash map for patient profiles

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await getPatients(); // Fetch patient array
        const patientMap = data.reduce((acc: PatientMap, patient: Patient) => {
          acc[patient.id] = patient;
          return acc;
        }, {});
        setPatientsMap(patientMap); // Set the hash map for patients
      } catch (error) {
        message.error("Failed to fetch patients.");
      } finally {
        setLoading(false);
      }
    };

    const fetchPatientProfiles = async () => {
      try {
        setLoading(true);
        const data = await getPatientProfiles(); // Fetch patient profiles array
        const profileMap = data.reduce(
          (acc: PatientProfileMap, profile: PatientProfile) => {
            acc[profile.user_id] = profile;
            return acc;
          },
          {}
        );
        setPatientProfilesMap(profileMap); // Set the hash map for patient profiles
      } catch (error) {
        message.error("Failed to fetch patient profiles.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
    fetchPatientProfiles();
  }, []);

  // Convert hash maps to arrays for rendering in tables
  const patientsArray = Object.values(patientsMap);
  const patientProfilesArray = Object.values(patientProfilesMap);

  // Columns configuration for Ant Design Table
  const columnsPatients = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Date of Birth",
      dataIndex: "date_of_birth",
      key: "date_of_birth",
      render: (date: string | null) =>
        date ? new Date(date).toLocaleDateString() : "N/A",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
  ];

  const columnsProfiles = [
    {
      title: "User",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "Race/Ethnicity",
      dataIndex: "race_ethnicity",
      key: "race_ethnicity",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Insurance Provider",
      dataIndex: "insurance_provider",
      key: "insurance_provider",
    },
    {
      title: "Medical Record",
      dataIndex: "medical_record",
      key: "medical_record",
    },
  ];

  if (loading) {
    return <Spin tip="Loading data..." />;
  }

  return (
    <div>
      <h1>Patients and Profiles</h1>

      <div>
        <h2>Patient List</h2>
        <Table
          columns={columnsPatients}
          dataSource={patientsArray} // Use the array version of the patients map
          rowKey="id"
          pagination={{ pageSize: 10 }} // Pagination for better UX
        />
      </div>

      <div>
        <h2>Patient Profiles</h2>
        <Table
          columns={columnsProfiles}
          dataSource={patientProfilesArray} // Use the array version of the patient profiles map
          rowKey="user_id"
          pagination={{ pageSize: 10 }} // Pagination for better UX
        />
      </div>
    </div>
  );
};

export default PatientList;
