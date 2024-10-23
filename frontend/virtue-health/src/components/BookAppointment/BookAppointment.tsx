import React, { useState } from "react";
import { DatePicker, Button, message } from "antd";
import moment, { Moment } from "moment";
import { scheduleAppointment } from "../../services/appointmentService";
import { updateDoctorProfile } from "../../services/doctorService"; // Assuming there's a service to update the doctor's profile

interface BookAppointmentProps {
  doctor: any; // Doctor data passed from the parent component
  onClose: () => void; // Callback to close the modal
  refreshDoctorData: () => void; // Callback to refresh doctor's data after booking
}

const BookAppointment: React.FC<BookAppointmentProps> = ({
  doctor,
  onClose,
  refreshDoctorData,
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Moment | null>(null); // State for selected appointment date and time

  // Handle date and time change
  const handleDateTimeChange = (value: Moment | null) => {
    setSelectedDateTime(value);
  };

  // Handle booking the appointment
  const handleSubmit = async () => {
    if (!selectedDateTime) {
      message.error("Please select an available time.");
      return;
    }

    try {
      // Book the appointment
      await scheduleAppointment({
        patient_id: 1, // Replace with actual patient ID
        doctor_id: doctor.id,
        date: selectedDateTime.toISOString(),
        reason: "OTHER", // Replace with actual reason if needed
        status: "PENDING",
      });

      // Remove the booked time from the doctor's available schedule
      const updatedSchedule = doctor.schedule.filter(
        (time: Date) => !moment(time).isSame(selectedDateTime, "minute")
      );

      // Update the doctor's profile with the new schedule
      await updateDoctorProfile(doctor.user_id, { schedule: updatedSchedule });

      message.success("Appointment booked successfully!");
      refreshDoctorData(); // Refresh the doctor's data after booking
      onClose(); // Close the modal after successful booking
    } catch (error) {
      message.error("Failed to book appointment.");
    }
  };

  // Disable time selection for unavailable slots and allow only 15-minute increments
  const disabledDateTime = () => {
    const validHours = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM

    return {
      disabledHours: () => {
        return Array.from({ length: 24 }, (_, i) => i).filter(
          (hour) => !validHours.includes(hour)
        );
      },
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour >= 9 && selectedHour <= 17) {
          return Array.from({ length: 60 }, (_, i) => i).filter(
            (minute) => ![0, 15, 30, 45].includes(minute)
          );
        }
        return Array.from({ length: 60 }, (_, i) => i); // Disable all minutes for invalid hours
      },
    };
  };

  return (
    <div>
      <DatePicker
        showTime={{ format: "HH:mm", minuteStep: 15 }} // 15-minute steps
        format="YYYY-MM-DD HH:mm"
        onChange={handleDateTimeChange}
        disabledDate={(currentDate) =>
          // Disable dates where there are no available times
          !doctor.schedule.some((time: Date) =>
            moment(time).isSame(currentDate, "day")
          )
        }
        disabledTime={disabledDateTime}
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        style={{ marginTop: "16px" }}
      >
        Submit
      </Button>
    </div>
  );
};

export default BookAppointment;
