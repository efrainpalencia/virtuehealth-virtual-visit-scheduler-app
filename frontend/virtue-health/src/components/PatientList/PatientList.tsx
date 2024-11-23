import React, { useEffect, useState } from "react";
import { Table, Input, Spin, Empty } from "antd";
import { Patient, getPatientsMap } from "../../services/patientService";

const { Search } = Input;

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const patientsMap = await getPatientsMap();
        const patientList = Object.values(patientsMap);

        setPatients(patientList);
        setFilteredPatients(patientList); // Initialize filteredPatients with all patients
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError("Failed to load patient data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = (searchTerm: string) => {
    const filtered = patients.filter((patient) =>
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "20% auto" }} />
    );
  }

  if (error) {
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, patient: Patient) =>
        `${patient.last_name || "N/A"}, ${patient.first_name || "N/A"}`,
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
      render: (date: string | null) => date || "N/A",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
  ];

  return (
    <div>
      <h1>Patients List</h1>

      <Search
        placeholder="Search patients by email..."
        onSearch={handleSearch}
        style={{ marginBottom: "20px", width: "100%" }}
      />

      {filteredPatients.length > 0 ? (
        <Table
          dataSource={filteredPatients}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      ) : (
        <Empty
          description="No patients found"
          style={{ margin: "10% auto", fontSize: "1.5rem" }}
        />
      )}
    </div>
  );
};

export default PatientList;
