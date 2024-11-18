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
  getDoctor,
  Doctor,
} from "../../services/doctorService";
import { getIdFromToken } from "../../services/authService";
import { getPatient, Patient } from "../../services/patientService";
import axios from "axios";

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
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const patientId = getIdFromToken(localStorage.getItem("access_token") || "");

  useEffect(() => {
    if (!patientId) {
      message.error("No patient ID found.");
      return;
    }
    const fetchData = async () => {
      try {
        const fetchedPatient = await getPatient(patientId);
        setPatient(fetchedPatient);
      } catch (error) {
        message.error("Failed to fetch patient data.");
      }
    };

    fetchData();
    fetchAppointments();
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

  const fetchDoctorDetails = async (doctorId: number) => {
    try {
      const doctorDetails = await getDoctor(doctorId);
      setDoctor(doctorDetails);
    } catch (error) {
      message.error("Failed to fetch doctor details.");
    }
  };

  const handleOpenRescheduleModal = async (appointment: Appointment) => {
    setSelectedAppointment(appointment);

    const doctorSchedule = doctorSchedules[appointment.doctor_id] || [];
    setAvailableTimes(doctorSchedule);

    // Fetch doctor details
    await fetchDoctorDetails(appointment.doctor_id);

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
    if (!selectedAppointment || !selectedDate || !selectedTime || !doctor) {
      message.error(
        "Please select both a date and time, and ensure doctor details are available."
      );
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

      // Trigger the email for rescheduling
      const emailPayload = {
        type: "reschedule",
        patient_email: patient?.email,
        doctor_email: doctor.email,
        context: {
          doctor_name: `${doctor.first_name} ${doctor.last_name}`,
          patient_name: `${patient?.first_name || ""} ${
            patient?.last_name || ""
          }`.trim(),
          new_appointment_date: newDate.format("YYYY-MM-DD"),
          new_appointment_time: newDate.format("HH:mm"),
        },
      };

      await axios.post(
        "http://127.0.0.1:8000/api/email/send-appointment/",
        emailPayload
      );

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
      console.error("Failed to reschedule appointment:", error);
      message.error("Failed to reschedule appointment.");
    }
  };

  const handleCancel = async (appointmentId: number) => {
    const appointment = appointments.find((app) => app.id === appointmentId);
    if (!appointment) return;

    try {
      // Fetch doctor details for email
      const doctorDetails = await getDoctor(appointment.doctor_id);

      // Trigger the email for appointment cancellation
      const emailPayload = {
        type: "cancel",
        patient_email: patient?.email,
        doctor_email: doctorDetails?.email,
        context: {
          doctor_name: `${doctorDetails?.first_name} ${doctorDetails?.last_name}`,
          patient_name: `${patient?.first_name || ""} ${
            patient?.last_name || ""
          }`.trim(),
          appointment_date: dayjs(appointment.date).format("YYYY-MM-DD"),
          appointment_time: dayjs(appointment.date).format("HH:mm"),
        },
      };

      await axios.post(
        "http://127.0.0.1:8000/api/email/send-appointment/",
        emailPayload
      );

      // Delete the appointment
      await deleteAppointment(appointmentId);

      // Add the canceled appointment date back to the doctor's schedule
      await addScheduleDate(appointment.doctor_id, appointment.date);

      message.success("Appointment canceled successfully and email sent.");
      fetchAppointments(); // Refresh the appointment list
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
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
          onChange={handleTimeChange}
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
