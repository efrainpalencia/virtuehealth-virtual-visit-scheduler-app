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

  // Filter available times when a date is selected
  const handleDateChange = (value: Dayjs | null) => {
    setSelectedDate(value);
    if (value) {
      // Filter the schedule to include only times on the selected day
      const filteredTimes = doctor.schedule
        .filter((time: Date) => dayjs(time).isSame(value, "day"))
        .map((time: Date) => dayjs(time));
      setAvailableTimes(filteredTimes);
    } else {
      setAvailableTimes([]);
    }
  };

  // Handle time selection
  const handleTimeChange = (value: Dayjs | null) => {
    setSelectedTime(value);
  };

  // Handle booking submission
  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      message.error("Please select an available date and time.");
      return;
    }

    // Combine selected date and time into a single datetime object
    const selectedDateTime = selectedDate
      .hour(selectedTime!.hour())
      .minute(selectedTime!.minute());
    onDateSelect(selectedDateTime);
    onClose();
  };

  // Disable unavailable times
  const disabledTime = (current: Dayjs) => {
    const validHours = availableTimes.map((time) => time.hour());
    const validMinutes = availableTimes.map((time) => time.minute());

    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => i).filter(
          (hour) => !validHours.includes(hour)
        ),
      disabledMinutes: (selectedHour: number) => {
        if (validHours.includes(selectedHour)) {
          return Array.from({ length: 60 }, (_, i) => i).filter(
            (minute) => !validMinutes.includes(minute)
          );
        }
        return Array.from({ length: 60 }, (_, i) => i);
      },
    };
  };

  return (
    <div>
      <DatePicker
        onChange={handleDateChange}
        disabledDate={(currentDate) =>
          !doctor.schedule.some((time: Date) =>
            dayjs(time).isSame(currentDate, "day")
          )
        }
      />
      <TimePicker
        value={selectedTime}
        onChange={handleTimeChange}
        disabledTime={disabledTime}
        format="HH:mm"
        minuteStep={15}
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
