import React, { useEffect, useState } from "react";
import {
  Patient,
  PatientProfile,
  getPatientsMap,
  getPatientProfilesMap,
} from "../../services/patientService";
import { Avatar, Col, List, Row, Select, Spin, Empty } from "antd"; // Import Select for dropdown
import man1 from "../../assets/man1.jpg";
import man2 from "../../assets/man2.jpg";
import man3 from "../../assets/man3.jpg";
import man4 from "../../assets/man4.jpg";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";

const { Option } = Select;

// Mapping of image URLs to imported images
const imgMap: { [key: string]: string } = {
  "man1.jpg": man1,
  "man2.jpg": man2,
  "man3.jpg": man3,
  "man4.jpg": man4,
  default: man1, // Default fallback image
};

const PatientList: React.FC = () => {
  const [combinedPatients, setCombinedPatients] = useState<
    Array<Patient & Partial<PatientProfile>>
  >([]);
  const [filteredPatients, setFilteredPatients] = useState<
    Array<Patient & Partial<PatientProfile>>
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientsAndProfiles = async () => {
      try {
        setLoading(true);
        const [patientsMap, profilesMap] = await Promise.all([
          getPatientsMap(),
          getPatientProfilesMap(),
        ]);

        const combinedList = Object.keys(patientsMap).map((patientId) => {
          const patient = patientsMap[parseInt(patientId)];
          const profile = profilesMap[parseInt(patientId)] || {};
          return { ...patient, ...profile };
        });

        setCombinedPatients(combinedList);
        setFilteredPatients(combinedList); // Initialize filteredPatients with all patients
        console.log("Combined Patients with Profiles:", combinedList);
      } catch (error) {
        console.error("Error fetching patients or profiles:", error);
        setError("Failed to load patient data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientsAndProfiles();
  }, []);

  // Handle search by name
  const handleSearch = (searchTerm: string) => {
    const filtered = combinedPatients.filter(
      (patient) =>
        patient.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  // Handle filtering by gender
  const handleGenderFilter = (gender: string) => {
    if (!gender) {
      setFilteredPatients(combinedPatients); // Reset filter if no gender is selected
    } else {
      const filtered = combinedPatients.filter(
        (patient) => patient.gender === gender
      );
      setFilteredPatients(filtered);
    }
  };

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "20% auto" }} />
    );
  }

  if (error) {
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  }

  return (
    <div>
      <h1>Patients List</h1>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={12}>
          <SearchBar
            placeholder="Search patients by name..."
            onSearch={handleSearch}
          />
        </Col>
        <Col className="gutter-row" span={12}>
          <Select
            placeholder="Filter by gender"
            style={{ width: "100%" }}
            onChange={handleGenderFilter}
            allowClear
          >
            <Option value="MALE">Male</Option>
            <Option value="FEMALE">Female</Option>
          </Select>
        </Col>
      </Row>

      {filteredPatients.length > 0 ? (
        <List
          style={{ display: "grid", alignItems: "center", minWidth: "500px" }}
          size="large"
          itemLayout="horizontal"
          dataSource={filteredPatients}
          renderItem={(patient) => {
            const imgSrc = imgMap[patient.img_url || "default"];

            return (
              <List.Item style={{ padding: "15px 0" }}>
                <List.Item.Meta
                  avatar={<Avatar src={imgSrc} />}
                  title={
                    <Link
                      to={`patient/${patient.id}`}
                      style={{ fontSize: "1.2rem" }}
                    >
                      {patient.last_name || "N/A"},{" "}
                      {patient.first_name || "N/A"}
                    </Link>
                  }
                  description={
                    <>
                      <p style={{ fontSize: "1rem" }}>
                        Date of Birth: {patient.date_of_birth || "N/A"}
                      </p>
                      <p style={{ fontSize: "1rem" }}>
                        Gender: {patient.gender || "N/A"}
                      </p>
                    </>
                  }
                />
              </List.Item>
            );
          }}
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
