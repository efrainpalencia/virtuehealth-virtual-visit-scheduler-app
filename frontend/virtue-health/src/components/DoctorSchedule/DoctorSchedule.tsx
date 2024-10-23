import React, { useState, useEffect } from "react";
import { Calendar, Button, TimePicker, List, message } from "antd";
import moment, { Moment } from "moment";
import {
  updateDoctorProfile,
  getDoctorProfile,
  getLoggedInDoctorId,
} from "../../services/doctorService"; // Assuming existing functions to get/update profile

const DoctorSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    [Moment, Moment] | null
  >(null);
  const [doctorSchedule, setDoctorSchedule] = useState<Date[]>([]); // Store doctor's current schedule

  // Get logged-in doctor's ID
  const doctorId = getLoggedInDoctorId();
  console.log(doctorId);

  useEffect(() => {
    // Fetch current doctor profile and schedule on mount
    const fetchDoctorProfile = async () => {
      try {
        const profile = await getDoctorProfile(doctorId);
        if (profile?.schedule) {
          setDoctorSchedule(
            profile.schedule.map((time: Date) => new Date(time))
          ); // Convert string dates to JS Date
        }
      } catch (error) {
        message.error("Failed to fetch doctor profile.");
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  // Handle date selection
  const handleDateSelect = (value: Moment) => {
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

    const startTime = moment(selectedDate).set({
      hour: selectedTimeRange[0].hour(),
      minute: selectedTimeRange[0].minute(),
    });
    const endTime = moment(selectedDate).set({
      hour: selectedTimeRange[1].hour(),
      minute: selectedTimeRange[1].minute(),
    });

    // Convert moments to Date before adding to schedule
    const newSlot = [startTime.toDate(), endTime.toDate()];
    const updatedSchedule = [...doctorSchedule, ...newSlot];

    setDoctorSchedule(updatedSchedule);
    message.success("Time slot added.");
  };

  // Save schedule to backend
  const handleSaveSchedule = async () => {
    try {
      // Convert schedule back to Date format
      const formattedSchedule = doctorSchedule.map((time) => new Date(time));
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
        disabledHours={() => [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23,
        ]} // Limit to office hours 9 AM to 5 PM
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
          moment(slot).format("YYYY-MM-DD HH:mm")
        )}
        renderItem={(item) => <List.Item>{item}</List.Item>}
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
