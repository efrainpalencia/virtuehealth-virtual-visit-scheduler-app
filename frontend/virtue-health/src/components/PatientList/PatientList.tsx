import React, { useEffect, useState } from "react";
import {
  Patient,
  PatientProfile,
  getPatientsMap,
  getPatientProfilesMap,
} from "../../services/patientService";
import { Avatar, Col, List, Row, Select } from "antd"; // Import Select for dropdown
import man1 from "../../assets/man1.jpg";
import man2 from "../../assets/man2.jpg";
import man3 from "../../assets/man3.jpg";
import man4 from "../../assets/man4.jpg";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";

// Mapping of image URLs to imported images
const imgMap: { [key: string]: string } = {
  "man1.jpg": man1,
  "man2.jpg": man2,
  "man3.jpg": man3,
  "man4.jpg": man4,
};

const PatientList: React.FC = () => {
  const [combinedPatients, setCombinedPatients] = useState<
    Array<Patient & Partial<PatientProfile>>
  >([]);
  const [filteredPatients, setFilteredPatients] = useState<
    Array<Patient & Partial<PatientProfile>>
  >([]);

  useEffect(() => {
    const fetchPatientsAndProfiles = async () => {
      try {
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
        setFilteredPatients(combinedList); // Initialize filteredDoctors with all doctors
        console.log("Combined Patients with Profiles:", combinedList);
      } catch (error) {
        console.error("Error fetching patients or profiles:", error);
      }
    };

    fetchPatientsAndProfiles();
  }, []);

  // Handle search by name
  const handleSearch = (searchTerm: string) => {
    const filtered = combinedPatients.filter(
      (patient) =>
        patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

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
      </Row>

      {/* Render the filtered doctor list */}
      <List
        style={{ display: "grid", alignItems: "center", minWidth: "500px" }}
        size="large"
        itemLayout="horizontal"
        dataSource={filteredPatients}
        renderItem={(patient) => {
          // Fallback to a default image if img_url is not found in the imgMap
          const imgSrc = imgMap[patient.img_url] || man1;

          return (
            <List.Item style={{ padding: "15px 0" }}>
              <List.Item.Meta
                title={
                  <Link
                    to={`patient/${patient.id}`}
                    style={{ fontSize: "1.2rem" }}
                  >
                    {patient.last_name || "N/A"}, {patient.first_name || "N/A"}
                  </Link>
                }
                description={
                  <>
                    <p style={{ fontSize: "1rem" }}>
                      Date of Birth: {patient.date_of_birth || "N/A"}
                    </p>
                  </>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default PatientList;
