import React, { useEffect, useState } from "react";
import { Table, Select, Input, Row, Col, Spin, Empty } from "antd";
import {
  getDoctorsMap,
  getDoctorProfilesMap,
  Doctor,
  DoctorProfile,
} from "../../services/doctorService";
import { Link } from "react-router-dom";

const { Option } = Select;
const { Search } = Input;

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorsAndProfiles = async () => {
      try {
        setLoading(true);

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
        setFilteredDoctors(combinedList);
      } catch (err) {
        console.error("Error fetching doctors or profiles:", err);
        setError(
          "Failed to fetch doctors or profiles. Please try again later."
        );
      } finally {
        setLoading(false);
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, doctor: Doctor) => (
        <Link to={`doctor/${doctor.id}`}>
          Dr. {doctor.last_name}, {doctor.first_name}
        </Link>
      ),
    },
    {
      title: "Specialty",
      dataIndex: "specialty",
      key: "specialty",
      render: (specialty: string) => specialtyMap[specialty] || "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      render: (phone_number: string | null) => phone_number || "N/A",
    },
  ];

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
      <h1>Doctors List</h1>

      <Row
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        style={{ marginBottom: "20px" }}
      >
        <Col span={12}>
          <Select
            style={{ width: "100%" }}
            placeholder="Select Specialty"
            onChange={handleSpecialtyChange}
            value={selectedSpecialty}
            allowClear
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
          <Search
            placeholder="Search doctors by name..."
            onSearch={handleSearch}
          />
        </Col>
      </Row>

      {filteredDoctors.length > 0 ? (
        <Table
          dataSource={filteredDoctors}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      ) : (
        <Empty
          description="No doctors found"
          style={{ margin: "10% auto", fontSize: "1.5rem" }}
        />
      )}
    </div>
  );
};

export default DoctorList;
