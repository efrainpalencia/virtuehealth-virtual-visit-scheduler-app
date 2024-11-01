import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, DatePicker, TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  getAppointments,
  updateAppointment,
  deleteAppointment,
  Appointment,
} from "../../services/appointmentService";
import {
  getDoctorProfile,
  addScheduleDate,
  removeScheduleDate,
} from "../../services/doctorService";
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
  const [doctorSchedules, setDoctorSchedules] = useState<{
    [key: number]: Dayjs[];
  }>({});
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isRescheduleModalVisible, setIsRescheduleModalVisible] =
    useState(false);
  const [availableTimes, setAvailableTimes] = useState<Dayjs[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null); // Add selectedTime state

  const patientId = getIdFromToken(localStorage.getItem("access_token") || "");

  useEffect(() => {
    if (patientId) fetchAppointments();
  }, [patientId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const appointmentsData = await getAppointments(patientId);
      setAppointments(appointmentsData);

      const uniqueDoctorIds = [
        ...new Set(appointmentsData.map((app) => app.doctor_id)),
      ];
      const scheduleMap: { [key: number]: Dayjs[] } = {};

      await Promise.all(
        uniqueDoctorIds.map(async (doctorId) => {
          const doctorProfile = await getDoctorProfile(doctorId);
          if (doctorProfile?.schedule) {
            scheduleMap[doctorId] = doctorProfile.schedule.map((time: Date) =>
              dayjs(time)
            );
          }
        })
      );
      setDoctorSchedules(scheduleMap);
    } catch (error) {
      message.error("Failed to load appointments or schedules.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRescheduleModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    const doctorSchedule = doctorSchedules[appointment.doctor_id] || [];
    setAvailableTimes(doctorSchedule);
    setIsRescheduleModalVisible(true);
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    if (date && selectedAppointment) {
      const doctorSchedule =
        doctorSchedules[selectedAppointment.doctor_id] || [];
      setAvailableTimes(
        doctorSchedule.filter((time) => time.isSame(date, "day"))
      );
    }
  };

  const handleTimeChange = (time: Dayjs | null) => {
    setSelectedTime(time);
  };

  const handleReschedule = async () => {
    if (!selectedAppointment || !selectedDate || !selectedTime) {
      message.error("Please select both a date and time.");
      return;
    }

    const newDate = selectedDate
      .hour(selectedTime.hour())
      .minute(selectedTime.minute())
      .second(0)
      .millisecond(0);
    const previousDate = dayjs(selectedAppointment.date); // Store previous date for re-adding to schedule

    try {
      // Update the appointment to the new date
      await updateAppointment(selectedAppointment.id!, {
        date: newDate.toISOString(),
      });

      // Add previous appointment date back to doctor's schedule
      await addScheduleDate(
        selectedAppointment.doctor_id,
        previousDate.toISOString()
      );

      // Remove the newly selected date from the doctor's schedule
      await removeScheduleDate(
        selectedAppointment.doctor_id,
        newDate.toISOString()
      );

      message.success("Appointment rescheduled successfully.");
      setIsRescheduleModalVisible(false);
      fetchAppointments(); // Refresh the appointment list
    } catch (error) {
      message.error("Failed to reschedule appointment.");
    }
  };

  const handleCancel = async (appointmentId: number) => {
    const appointment = appointments.find((app) => app.id === appointmentId);
    if (!appointment) return;

    try {
      await deleteAppointment(appointmentId);
      await addScheduleDate(appointment.doctor_id, appointment.date);
      message.success("Appointment canceled successfully.");
      fetchAppointments();
    } catch (error) {
      message.error("Failed to cancel appointment.");
    }
  };

  return (
    <div>
      <h2>Your Appointments</h2>
      <Table
        loading={loading}
        dataSource={appointments.filter((app) => app.patient_id === patientId)}
        rowKey="id"
        columns={[
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
            title: "Actions",
            render: (_: any, record: Appointment) => (
              <>
                <Button
                  type="link"
                  onClick={() => handleOpenRescheduleModal(record)}
                >
                  Reschedule
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleCancel(record.id!)}
                >
                  Cancel
                </Button>
              </>
            ),
          },
        ]}
      />

      <Modal
        title="Reschedule Appointment"
        visible={isRescheduleModalVisible}
        onCancel={() => setIsRescheduleModalVisible(false)}
        onOk={handleReschedule}
        okText="Reschedule"
      >
        <DatePicker
          onChange={handleDateChange}
          disabledDate={(currentDate) =>
            !availableTimes.some((time) => time.isSame(currentDate, "day"))
          }
        />
        <TimePicker
          format="HH:mm"
          disabled={!selectedDate}
          minuteStep={15}
          onChange={handleTimeChange} // Use the handleTimeChange to set selected time
          disabledHours={() => {
            const hours = Array.from({ length: 24 }, (_, i) => i);
            return hours.filter(
              (hour) => !availableTimes.some((time) => time.hour() === hour)
            );
          }}
          disabledMinutes={(selectedHour) => {
            const minutes = Array.from({ length: 60 }, (_, i) => i);
            return minutes.filter(
              (minute) =>
                !availableTimes.some(
                  (time) =>
                    time.hour() === selectedHour && time.minute() === minute
                )
            );
          }}
        />
      </Modal>
    </div>
  );
};

export default PatientAppointments;
