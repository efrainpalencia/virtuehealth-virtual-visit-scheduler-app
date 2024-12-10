import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import {
  Appointment,
  getAppointmentsByDoctorId,
} from "../../services/appointmentService";
import { getPatientsMap, Patient } from "../../services/patientService";
import { getIdFromToken } from "../../services/authService";
import dayjs from "dayjs";

const reasonDisplayMap = {
  CHRONIC_CARE: "Chronic Care",
  PREVENTATIVE_CARE: "Preventative Care",
  SURGICAL_POST_OP: "Surgical Post-op",
  OTHER: "Other",
};

const statusDisplayMap = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
};

const DoctorAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientsMap, setPatientsMap] = useState<{ [key: number]: Patient }>(
    {}
  );

  const doctorId = getIdFromToken(localStorage.getItem("access_token") || "");
  console.log("doctorId", doctorId);

  useEffect(() => {
    if (!doctorId) {
      message.error("No doctor ID found.");
      return;
    }

    const fetchAppointments = async () => {
      try {
        setLoading(true);

        // Fetch appointments for the doctor
        const appointmentsData = await getAppointmentsByDoctorId(doctorId);
        setAppointments(appointmentsData);

        // Fetch patients and map them by their ID
        const patientsData = await getPatientsMap();
        setPatientsMap(patientsData);
      } catch (error) {
        message.error("Failed to load appointments or patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (reason: string) => reasonDisplayMap[reason] || reason,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => statusDisplayMap[status] || status,
    },
    {
      title: "Patient Name",
      dataIndex: "patient_id",
      render: (patientId: number) => {
        const patient = patientsMap[patientId];
        return patient ? `${patient.first_name} ${patient.last_name}` : "N/A";
      },
    },
    {
      title: "Patient Email",
      dataIndex: "patient_id",
      render: (patientId: number) => {
        const patient = patientsMap[patientId];
        return patient ? patient.email : "N/A";
      },
    },
  ];

  return (
    <div>
      <h2>Doctor's Appointments</h2>
      <Table
        loading={loading}
        dataSource={appointments}
        rowKey="id"
        columns={columns}
      />
    </div>
  );
};

export default DoctorAppointments;
