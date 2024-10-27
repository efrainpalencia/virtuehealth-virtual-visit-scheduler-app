import React, { useState, useEffect } from "react";
import { DatePicker, TimePicker, Button, message } from "antd";
import dayjs, { Dayjs } from "dayjs";

interface BookAppointmentProps {
  doctor: any; // Doctor data passed from the parent component
  onClose: () => void; // Callback to close the modal
  onDateSelect: (selectedDateTime: Dayjs) => void; // Callback to pass selected date to the AppointmentForm
}

const BookAppointment: React.FC<BookAppointmentProps> = ({
  doctor,
  onClose,
  onDateSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [availableTimes, setAvailableTimes] = useState<Dayjs[]>([]);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);

  // Update available times whenever the date or doctor's schedule changes
  useEffect(() => {
    if (selectedDate) {
      const isToday = selectedDate.isSame(dayjs(), "day");

      // Filter times to include only valid slots for the selected day
      const filteredTimes = doctor.schedule
        .filter((time: Date) => {
          const timeObj = dayjs(time);
          return (
            timeObj.isSame(selectedDate, "day") &&
            (!isToday || timeObj.isAfter(dayjs().add(30, "minute"))) // Exclude times within the next 30 min if today
          );
        })
        .map((time: Date) => dayjs(time));

      setAvailableTimes(filteredTimes);
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate, doctor.schedule]);

  const handleDateChange = (value: Dayjs | null) => {
    setSelectedDate(value);
  };

  const handleTimeChange = (value: Dayjs | null) => {
    setSelectedTime(value);
  };

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      message.error("Please select an available date and time.");
      return;
    }

    const selectedDateTime = selectedDate
      .hour(selectedTime.hour())
      .minute(selectedTime.minute());
    onDateSelect(selectedDateTime);
    onClose();
  };

  return (
    <div>
      <DatePicker
        onChange={handleDateChange}
        disabledDate={(currentDate) =>
          currentDate && currentDate.isBefore(dayjs(), "day")
        }
      />
      <TimePicker
        value={selectedTime}
        onChange={handleTimeChange}
        format="HH:mm"
        minuteStep={15}
        disabledHours={() =>
          Array.from({ length: 24 }, (_, i) => i).filter(
            (hour) => !availableTimes.some((time) => time.hour() === hour)
          )
        }
        disabledMinutes={(selectedHour) => {
          const validMinutes = availableTimes
            .filter((time) => time.hour() === selectedHour)
            .map((time) => time.minute());
          return Array.from({ length: 60 }, (_, i) => i).filter(
            (minute) => !validMinutes.includes(minute)
          );
        }}
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
