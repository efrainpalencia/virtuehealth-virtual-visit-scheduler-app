import React, { useState, useEffect } from "react";
import { Calendar, Button, TimePicker, List, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  updateDoctorProfile,
  getDoctorProfile,
} from "../../services/doctorService";
import { getIdFromToken } from "../../services/authService";

dayjs.extend(utc);

const DoctorSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [doctorSchedule, setDoctorSchedule] = useState<string[]>([]);
  const doctorId = getIdFromToken(localStorage.getItem("access_token") || "");

  useEffect(() => {
    if (!doctorId) {
      message.error("No doctor ID found.");
      return;
    }

    const fetchData = async () => {
      try {
        const profile = await getDoctorProfile(doctorId);
        if (profile?.schedule) {
          setDoctorSchedule(
            profile.schedule.map((slot: string) =>
              dayjs(slot).utc().toISOString()
            )
          );
        }
      } catch (error) {
        message.error("Failed to fetch doctor schedule.");
        console.error(error);
      }
    };

    fetchData();
  }, [doctorId]);

  const handleDateSelect = (value: Dayjs) => {
    setSelectedDate(value);
  };

  const handleTimeSelect = (value: Dayjs | null) => {
    setSelectedTime(value);
  };

  const handleAddTimeSlot = () => {
    if (!selectedDate || !selectedTime) {
      message.error("Please select a date and time.");
      return;
    }

    const newSlot = selectedDate
      .hour(selectedTime.hour())
      .minute(selectedTime.minute())
      .second(0)
      .millisecond(0)
      .utc()
      .toISOString();

    if (doctorSchedule.includes(newSlot)) {
      message.error("This time slot is already in your schedule.");
      return;
    }

    setDoctorSchedule([...doctorSchedule, newSlot]);
    message.success("Time slot added.");
  };

  const handleRemoveTimeSlot = (slotToRemove: string) => {
    setDoctorSchedule(doctorSchedule.filter((slot) => slot !== slotToRemove));
    message.success("Time slot removed.");
  };

  const handleSaveSchedule = async () => {
    try {
      await updateDoctorProfile(doctorId, { schedule: doctorSchedule });
      message.success("Schedule updated successfully!");
    } catch (error) {
      message.error("Failed to update schedule.");
    }
  };

  return (
    <div>
      <h1>Set Your Availability</h1>
      <Calendar
        fullscreen={false}
        onSelect={handleDateSelect}
        disabledDate={(current) => current && current < dayjs().startOf("day")}
      />
      <TimePicker
        value={selectedTime}
        onChange={handleTimeSelect}
        format="HH:mm"
        minuteStep={30}
        disabledTime={() => ({
          disabledHours: () => [
            ...Array.from({ length: 9 }, (_, i) => i), // Disable hours before 9 AM
            ...Array.from({ length: 8 }, (_, i) => i + 17), // Disable hours after 5 PM
          ],
        })}
        style={{ marginTop: 16 }}
      />
      <Button
        type="primary"
        onClick={handleAddTimeSlot}
        style={{ marginTop: 16 }}
      >
        Add Time Slot
      </Button>
      <List
        header={<div>Your Current Availability</div>}
        bordered
        dataSource={doctorSchedule.map((slot) =>
          dayjs(slot).local().format("YYYY-MM-DD HH:mm")
        )}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button
                type="link"
                onClick={() => handleRemoveTimeSlot(doctorSchedule[index])}
              >
                Remove
              </Button>,
            ]}
          >
            {item}
          </List.Item>
        )}
        style={{ marginTop: 16 }}
      />
      <Button
        type="primary"
        onClick={handleSaveSchedule}
        style={{ marginTop: 16 }}
      >
        Save Schedule
      </Button>
    </div>
  );
};

export default DoctorSchedule;
