import React, { useState, useEffect } from "react";
import { Calendar, Button, TimePicker, List, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  updateDoctorProfile,
  getDoctorProfile,
} from "../../services/doctorService";
import { getIdFromToken } from "../../services/authService";

dayjs.extend(utc); // enable UTC plugin for dayjs

const getLoggedInDoctorId = (): number | null => {
  const token = localStorage.getItem("access_token");
  if (token) {
    try {
      return getIdFromToken(token);
    } catch (error) {
      console.error("Failed to decode token", error);
      return null;
    }
  }
  return null;
};

const DoctorSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [doctorSchedule, setDoctorSchedule] = useState<string[]>([]); // Store doctor's current schedule

  const doctorId = getLoggedInDoctorId();

  useEffect(() => {
    if (!doctorId) {
      message.error("No doctor ID found.");
      return;
    }
    // Fetch current doctor profile and schedule on mount
    const fetchDoctorProfile = async () => {
      try {
        const profile = await getDoctorProfile(doctorId);
        if (profile?.schedule) {
          setDoctorSchedule(profile.schedule);
        }
      } catch (error) {
        message.error("Failed to fetch doctor profile.");
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  // Handle date selection
  const handleDateSelect = (value: Dayjs) => {
    setSelectedDate(value);
  };

  // Handle time selection
  const handleTimeSelect = (value: Dayjs | null) => {
    setSelectedTime(value);
  };

  // Ensure UTC with zeroed seconds and milliseconds before adding to schedule
  const handleAddTimeSlot = () => {
    if (!selectedDate || !selectedTime) {
      message.error("Please select a date and start time.");
      return;
    }

    // Combine selected date and time, set seconds/milliseconds to 0, then format as ISO UTC string
    const newSlot = selectedDate
      .hour(selectedTime.hour())
      .minute(selectedTime.minute())
      .second(0)
      .millisecond(0)
      .utc()
      .toISOString(); // Save as ISO string in UTC with no seconds or milliseconds

    setDoctorSchedule([...doctorSchedule, newSlot]);
    message.success("Time slot added.");
  };

  // Remove a time slot from the schedule
  const handleRemoveTimeSlot = (slotToRemove: string) => {
    const updatedSchedule = doctorSchedule.filter(
      (slot) => slot !== slotToRemove
    );
    setDoctorSchedule(updatedSchedule);
    message.success("Time slot removed.");
  };

  // Save schedule to backend with dates in UTC
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
        disabledDate={(current) =>
          current && (current.day() === 0 || current.day() === 6)
        } // Disable weekends
      />
      <TimePicker
        value={selectedTime}
        onChange={handleTimeSelect}
        format="HH:mm"
        minuteStep={30}
        disabledHours={() => [
          ...Array.from({ length: 9 }, (_, i) => i),
          ...Array.from({ length: 8 }, (_, i) => i + 17),
        ]}
        style={{ marginTop: 16 }}
      />
      <Button
        type="primary"
        onClick={handleAddTimeSlot}
        style={{ marginTop: 16 }}
      >
        Add Time Slot
      </Button>

      {/* Display the doctor's current schedule */}
      <List
        header={<div>Your Current Availability</div>}
        bordered
        dataSource={doctorSchedule.map((slot) =>
          dayjs(slot).format("YYYY-MM-DD HH:mm")
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
