import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  getAppointments,
  updateAppointment,
  deleteAppointment,
  Appointment,
} from "../../services/appointmentService";
import { getDoctorProfile } from "../../services/doctorService";
import { getIdFromToken } from "../../services/authService";

const PatientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorProfiles, setDoctorProfiles] = useState<{ [key: number]: any }>(
    {}
  );
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
      const profileMap: { [key: number]: any } = {};

      await Promise.all(
        uniqueDoctorIds.map(async (doctorId) => {
          const doctorProfile = await getDoctorProfile(doctorId);
          profileMap[doctorId] = doctorProfile;
        })
      );

      setDoctorProfiles(profileMap);
    } catch (error) {
      message.error("Failed to load appointments or doctor schedules.");
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
      const doctorId = selectedAppointment.doctor_id;
      const doctorSchedule = doctorProfiles[doctorId]?.schedule || [];

      const isWithinSchedule = doctorSchedule.some((slot: string) =>
        dayjs(slot).isSame(newDate, "minute")
      );
      if (!isWithinSchedule) {
        message.error(
          "Selected time is outside the doctor’s available schedule."
        );
        return;
      }

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
      render: (doctorId: number) =>
        `${doctorProfiles[doctorId]?.user.first_name} ${doctorProfiles[doctorId]?.user.last_name}` ||
        "Loading...",
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
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
          disabledDate={(currentDate) => {
            // Disable past dates
            return currentDate && currentDate.isBefore(dayjs(), "day");
          }}
          disabledTime={(date) => {
            const doctorId = selectedAppointment?.doctor_id;
            const doctorSchedule = doctorProfiles[doctorId]?.schedule || [];
            const now = dayjs();

            return {
              disabledHours: () => {
                const hoursAvailable = doctorSchedule
                  .filter(
                    (time: Date) =>
                      dayjs(time).isSame(date, "day") &&
                      dayjs(time).isAfter(now.add(30, "minute"))
                  )
                  .map((time: Date) => dayjs(time).hour());
                return Array.from({ length: 24 }, (_, i) => i).filter(
                  (hour) => !hoursAvailable.includes(hour)
                );
              },
              disabledMinutes: (selectedHour: number) => {
                const minutesAvailable = doctorSchedule
                  .filter(
                    (time: Date) =>
                      dayjs(time).hour() === selectedHour &&
                      dayjs(time).isAfter(now.add(30, "minute"))
                  )
                  .map((time: Date) => dayjs(time).minute());
                return Array.from({ length: 60 }, (_, i) => i).filter(
                  (minute) => !minutesAvailable.includes(minute)
                );
              },
            };
          }}
        />
      </Modal>
    </div>
  );
};

export default PatientAppointments;
