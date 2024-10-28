import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  getAppointments,
  updateAppointment,
  deleteAppointment,
  Appointment,
} from "../../services/appointmentService";
import { getDoctor } from "../../services/doctorService";
import { getIdFromToken } from "../../services/authService";

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

const PatientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorNames, setDoctorNames] = useState<{ [key: number]: string }>({});
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isRescheduleModalVisible, setIsRescheduleModalVisible] =
    useState(false);

  const patientId = getIdFromToken(localStorage.getItem("access_token") || "");

  useEffect(() => {
    if (patientId) {
      fetchAppointments();
    }
  }, [patientId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const appointmentsData = await getAppointments(patientId);
      setAppointments(appointmentsData);

      const uniqueDoctorIds = [
        ...new Set(appointmentsData.map((app) => app.doctor_id)),
      ];

      const doctorNameMap: { [key: number]: string } = {};

      await Promise.all(
        uniqueDoctorIds.map(async (doctorId) => {
          const doctor = await getDoctor(doctorId); // Fetch doctor details
          if (doctor) {
            doctorNameMap[
              doctorId
            ] = `${doctor.first_name} ${doctor.last_name}`;
          }
        })
      );

      setDoctorNames(doctorNameMap);
    } catch (error) {
      message.error("Failed to load appointments or doctor details.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRescheduleModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleModalVisible(true);
  };

  const handleReschedule = async (newDate: Dayjs) => {
    if (selectedAppointment) {
      try {
        await updateAppointment(selectedAppointment.id!, {
          date: newDate.toISOString(),
        });
        message.success("Appointment rescheduled successfully.");
        setIsRescheduleModalVisible(false);
        fetchAppointments();
      } catch (error) {
        message.error("Failed to reschedule appointment.");
      }
    }
  };

  const handleCancel = async (appointmentId: number) => {
    try {
      await deleteAppointment(appointmentId);
      message.success("Appointment canceled successfully.");
      fetchAppointments();
    } catch (error) {
      message.error("Failed to cancel appointment.");
    }
  };

  const columns = [
    {
      title: "Doctor",
      dataIndex: "doctor_id",
      key: "doctor_id",
      render: (doctorId: number) => doctorNames[doctorId] || "Loading...",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (reason: string) => reasonDisplayMap[reason] || reason,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => statusDisplayMap[status] || status,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: Appointment) => (
        <>
          <Button type="link" onClick={() => handleOpenRescheduleModal(record)}>
            Reschedule
          </Button>
          <Button type="link" danger onClick={() => handleCancel(record.id!)}>
            Cancel
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Your Appointments</h2>
      <Table
        loading={loading}
        columns={columns}
        dataSource={appointments.filter((app) => app.patient_id === patientId)}
        rowKey="id"
      />

      <Modal
        title="Reschedule Appointment"
        visible={isRescheduleModalVisible}
        onCancel={() => setIsRescheduleModalVisible(false)}
        onOk={() =>
          selectedAppointment &&
          handleReschedule(dayjs(selectedAppointment.date))
        }
        okText="Reschedule"
      >
        <DatePicker
          showTime={{ format: "HH:mm", minuteStep: 15 }}
          format="YYYY-MM-DD HH:mm"
          onChange={(date) =>
            date &&
            setSelectedAppointment({
              ...selectedAppointment!,
              date: date.toISOString(),
            })
          }
          disabledDate={(currentDate) =>
            currentDate && currentDate.isBefore(dayjs(), "day")
          }
        />
      </Modal>
    </div>
  );
};

export default PatientAppointments;
