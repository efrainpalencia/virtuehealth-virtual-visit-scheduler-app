import React, { useState, useEffect } from "react";
import { Calendar, Button, TimePicker, List, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  updateDoctorProfile,
  getDoctorProfile,
} from "../../services/doctorService";
import { getIdFromToken } from "../../services/authService";

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
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    [Dayjs, Dayjs] | null
  >(null);
  const [doctorSchedule, setDoctorSchedule] = useState<Date[]>([]); // Store doctor's current schedule

  // Get logged-in doctor's ID
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
          setDoctorSchedule(
            profile.schedule.map((time: string) => new Date(time))
          );
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

  // Handle time range selection
  const handleTimeRangeSelect = (times: any) => {
    setSelectedTimeRange(times);
  };

  // Add available time slot to the schedule
  const handleAddTimeSlot = () => {
    if (!selectedDate || !selectedTimeRange) {
      message.error("Please select a date and time.");
      return;
    }

    // Initialize startTime and endTime with selectedDate and then set the time components
    const startTime = dayjs(selectedDate)
      .hour(selectedTimeRange[0].hour())
      .minute(selectedTimeRange[0].minute())
      .second(0);
    const endTime = dayjs(selectedDate)
      .hour(selectedTimeRange[1].hour())
      .minute(selectedTimeRange[1].minute())
      .second(0);

    // Convert to Date before adding to schedule
    const newSlot = [startTime.toDate(), endTime.toDate()];
    const updatedSchedule = [...doctorSchedule, ...newSlot];

    setDoctorSchedule(updatedSchedule);
    message.success("Time slot added.");
  };

  // Remove a time slot from the schedule
  const handleRemoveTimeSlot = (slotToRemove: Date) => {
    const updatedSchedule = doctorSchedule.filter(
      (slot) => slot.getTime() !== slotToRemove.getTime()
    );
    setDoctorSchedule(updatedSchedule);
    message.success("Time slot removed.");
  };

  // Save schedule to backend
  const handleSaveSchedule = async () => {
    try {
      // If no time slots are available, send an empty array to backend
      const formattedSchedule =
        doctorSchedule.length > 0
          ? doctorSchedule.map((time) => new Date(time))
          : [];
      await updateDoctorProfile(doctorId, { schedule: formattedSchedule });
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
      <TimePicker.RangePicker
        minuteStep={15}
        format="HH:mm"
        disabledTime={(current) => {
          const disabledHours = Array.from({ length: 24 }, (_, i) => i).filter(
            (hour) => hour < 9 || hour >= 17
          );

          return {
            disabledHours: () => disabledHours,
            disabledMinutes: () => {
              // Enable minutes only in 15-minute intervals (0, 15, 30, 45)
              const allMinutes = Array.from({ length: 60 }, (_, i) => i);
              return allMinutes.filter(
                (minute) => ![0, 15, 30, 45].includes(minute)
              );
            },
          };
        }}
        onChange={handleTimeRangeSelect}
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
