import React, { useEffect, useState } from "react";
import {
  getDoctorsMap,
  getDoctorProfilesMap,
  Doctor,
  DoctorProfile,
} from "../../services/doctorService";
import { Avatar, Col, List, Row, Select } from "antd"; // Import Select for dropdown
import man1 from "../../assets/man1.jpg";
import man2 from "../../assets/man2.jpg";
import man3 from "../../assets/man3.jpg";
import man4 from "../../assets/man4.jpg";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";

const { Option } = Select;

const specialtyMap = {
  GENERAL_DOCTOR: "General Doctor",
  CARDIOLOGIST: "Cardiologist",
  ORTHOPEDIST: "Orthopedist",
  NEUROLIGIST: "Neurologist",
  PSYCHIATRIST: "Psychiatrist",
  PEDIATRICIAON: "Pediatrician",
};

// Mapping of image URLs to imported images
const imgMap: { [key: string]: string } = {
  "man1.jpg": man1,
  "man2.jpg": man2,
  "man3.jpg": man3,
  "man4.jpg": man4,
};

const DoctorList: React.FC = () => {
  const [combinedDoctors, setCombinedDoctors] = useState<
    Array<Doctor & Partial<DoctorProfile>>
  >([]);
  const [filteredDoctors, setFilteredDoctors] = useState<
    Array<Doctor & Partial<DoctorProfile>>
  >([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchDoctorsAndProfiles = async () => {
      try {
        const [doctorsMap, profilesMap] = await Promise.all([
          getDoctorsMap(),
          getDoctorProfilesMap(),
        ]);

        const combinedList = Object.keys(doctorsMap).map((doctorId) => {
          const doctor = doctorsMap[parseInt(doctorId)];
          const profile = profilesMap[parseInt(doctorId)] || {};
          return { ...doctor, ...profile };
        });

        setCombinedDoctors(combinedList);
        setFilteredDoctors(combinedList); // Initialize filteredDoctors with all doctors
        console.log("Combined Doctors with Profiles:", combinedList);
      } catch (error) {
        console.error("Error fetching doctors or profiles:", error);
      }
    };

    fetchDoctorsAndProfiles();
  }, []);

  // Handle specialty change
  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value);

    if (value === "ALL") {
      setFilteredDoctors(combinedDoctors); // Show all doctors
    } else {
      const filtered = combinedDoctors.filter(
        (doctor) => doctor.specialty === value
      );
      setFilteredDoctors(filtered);
    }
  };

  // Handle search by name
  const handleSearch = (searchTerm: string) => {
    const filtered = combinedDoctors.filter(
      (doctor) =>
        doctor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  return (
    <div>
      <h1>Doctors List</h1>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={12}>
          <Select
            style={{ width: 200, marginBottom: 20 }}
            placeholder="Select Specialty"
            onChange={handleSpecialtyChange}
            value={selectedSpecialty}
          >
            <Option value="ALL">All Specialties</Option>
            {Object.keys(specialtyMap).map((specialtyKey) => (
              <Option key={specialtyKey} value={specialtyKey}>
                {specialtyMap[specialtyKey]}
              </Option>
            ))}
          </Select>
        </Col>
        <Col className="gutter-row" span={12}>
          <SearchBar
            placeholder="Search doctors by name..."
            onSearch={handleSearch}
          />
        </Col>
      </Row>

      {/* Render the filtered doctor list */}
      <List
        style={{ display: "grid", alignItems: "center", minWidth: "500px" }}
        size="large"
        itemLayout="horizontal"
        dataSource={filteredDoctors}
        renderItem={(doctor) => {
          // Fallback to a default image if img_url is not found in the imgMap
          const imgSrc = imgMap[doctor.img_url] || man1;

          return (
            <List.Item style={{ padding: "15px 0" }}>
              <List.Item.Meta
                avatar={<Avatar src={imgSrc} size={64} />}
                title={
                  <Link
                    to={`doctor/${doctor.id}`}
                    style={{ fontSize: "1.2rem" }}
                  >
                    Dr. {doctor.last_name}
                  </Link>
                }
                description={
                  <>
                    <p style={{ fontSize: "1rem" }}>
                      Specialty: {specialtyMap[doctor.specialty] || "N/A"}
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

export default DoctorList;
