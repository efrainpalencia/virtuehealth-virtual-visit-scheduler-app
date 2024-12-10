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

      // Filter and format times to include only valid slots for the selected day, with seconds/milliseconds set to 0
      const filteredTimes = doctor.schedule
        .filter((time: Date) => {
          const timeObj = dayjs(time).second(0).millisecond(0); // Remove seconds and milliseconds here
          return (
            timeObj.isSame(selectedDate, "day") &&
            (!isToday || timeObj.isAfter(dayjs().add(30, "minute"))) // Exclude times within the next 30 min if today
          );
        })
        .map((time: Date) => dayjs(time).second(0).millisecond(0)); // Also ensure time is formatted on display

      setAvailableTimes(filteredTimes);
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate, doctor.schedule]);

  const handleDateChange = (value: Dayjs | null) => {
    setSelectedDate(value);
  };

  const handleTimeChange = (value: Dayjs | null) => {
    setSelectedTime(value ? value.second(0).millisecond(0) : null); // Remove seconds/milliseconds here too
  };

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      message.error("Please select an available date and time.");
      return;
    }

    const selectedDateTime = selectedDate
      .hour(selectedTime.hour())
      .minute(selectedTime.minute())
      .second(0)
      .millisecond(0); // Finalize removing seconds and milliseconds for consistency
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
        minuteStep={30} // Set minute step to 30 to limit to 30-minute intervals
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
