import React, { useEffect, useState } from "react";
import {
  getDoctorsMap,
  getDoctorProfilesMap,
  Doctor,
  DoctorProfile,
} from "../../services/doctorService";
import { Avatar, Col, List, Row, Select } from "antd";
import man1 from "../../assets/man1.jpg";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";

const { Option } = Select;

const specialtyMap = {
  GENERAL_DOCTOR: "General Doctor",
  CARDIOLOGIST: "Cardiologist",
  ORTHOPEDIST: "Orthopedist",
  NEUROLOGIST: "Neurologist",
  PSYCHIATRIST: "Psychiatrist",
  PEDIATRICIAN: "Pediatrician",
};

const DoctorList: React.FC = () => {
  const [combinedDoctors, setCombinedDoctors] = useState<
    Array<Doctor & Partial<DoctorProfile>>
  >([]);
  const [filteredDoctors, setFilteredDoctors] = useState<
    Array<Doctor & Partial<DoctorProfile>>
  >([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("ALL");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorsAndProfiles = async () => {
      try {
        const [doctorsMap, profilesMap] = await Promise.all([
          getDoctorsMap(),
          getDoctorProfilesMap(),
        ]);

        console.log("Doctors Map:", doctorsMap);
        console.log("Profiles Map:", profilesMap);

        const combinedList = Object.keys(doctorsMap).map((doctorId) => {
          const doctor = doctorsMap[parseInt(doctorId)];
          const profile = profilesMap[parseInt(doctorId)] || {};
          return { ...doctor, ...profile };
        });

        setCombinedDoctors(combinedList);
        setFilteredDoctors(combinedList);
      } catch (err) {
        console.error("Error fetching doctors or profiles:", err);
        setError(
          "Failed to fetch doctors or profiles. Please try again later."
        );
      }
    };

    fetchDoctorsAndProfiles();
  }, []);

  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value);

    if (value === "ALL") {
      setFilteredDoctors(combinedDoctors);
    } else {
      const filtered = combinedDoctors.filter(
        (doctor) => doctor.specialty === value
      );
      setFilteredDoctors(filtered);
    }
  };

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
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
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
        <Col span={12}>
          <SearchBar
            placeholder="Search doctors by name..."
            onSearch={handleSearch}
          />
        </Col>
      </Row>

      <List
        style={{ display: "grid", alignItems: "center", minWidth: "500px" }}
        size="large"
        itemLayout="horizontal"
        dataSource={filteredDoctors}
        renderItem={(doctor) => {
          const imgSrc = doctor.img_url || man1;

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
                  <p style={{ fontSize: "1rem" }}>
                    Specialty: {specialtyMap[doctor.specialty] || "N/A"}
                  </p>
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
