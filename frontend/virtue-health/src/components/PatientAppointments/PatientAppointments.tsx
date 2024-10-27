import React, { useEffect, useState } from "react";
import { List, Button, Modal, DatePicker, message, Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  getAppointments,
  updateAppointment,
  deleteAppointment,
} from "../../services/appointmentService";
import { getIdFromToken } from "../../services/authService";

interface Appointment {
  id: number;
  date: string;
  reason: string;
  doctorName: string;
  status: string;
}

const PatientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<Dayjs | null>(null);

  const patientId = getIdFromToken(localStorage.getItem("access_token") || "");

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const appointments = await getAppointments(patientId);
        setAppointments(appointments);
      } catch (error) {
        message.error("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  const showRescheduleModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(dayjs(appointment.date));
    setRescheduleModalVisible(true);
  };

  const handleReschedule = async () => {
    if (!newDate || !selectedAppointment) return;

    try {
      await updateAppointment(selectedAppointment.id, {
        date: newDate.toISOString(),
      });
      message.success("Appointment rescheduled successfully!");
      setRescheduleModalVisible(false);
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === selectedAppointment.id
            ? { ...appointment, date: newDate.toISOString() }
            : appointment
        )
      );
    } catch (error) {
      message.error("Failed to reschedule appointment.");
    }
  };

  const handleCancel = async (appointmentId: number) => {
    try {
      await deleteAppointment(appointmentId);
      message.success("Appointment canceled successfully!");
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== appointmentId)
      );
    } catch (error) {
      message.error("Failed to cancel appointment.");
    }
  };

  if (loading) return <Spin tip="Loading appointments..." />;

  return (
    <div style={{ padding: 24 }}>
      <h2>Your Appointments</h2>
      <List
        bordered
        dataSource={appointments}
        renderItem={(appointment) => (
          <List.Item
            actions={[
              <Button
                type="link"
                onClick={() => showRescheduleModal(appointment)}
              >
                Reschedule
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleCancel(appointment.id)}
              >
                Cancel
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={`Appointment with Dr. ${appointment.doctorName}`}
              description={`Date: ${dayjs(appointment.date).format(
                "YYYY-MM-DD HH:mm"
              )}, Reason: ${appointment.reason}, Status: ${appointment.status}`}
            />
          </List.Item>
        )}
      />

      {/* Reschedule Modal */}
      <Modal
        title="Reschedule Appointment"
        visible={rescheduleModalVisible}
        onCancel={() => setRescheduleModalVisible(false)}
        onOk={handleReschedule}
        okText="Reschedule"
      >
        <DatePicker
          showTime={{ format: "HH:mm", minuteStep: 15 }}
          format="YYYY-MM-DD HH:mm"
          value={newDate}
          onChange={(date) => setNewDate(date)}
          disabledDate={(currentDate) =>
            currentDate && currentDate.isBefore(dayjs(), "day")
          }
        />
      </Modal>
    </div>
  );
};

export default PatientAppointments;
