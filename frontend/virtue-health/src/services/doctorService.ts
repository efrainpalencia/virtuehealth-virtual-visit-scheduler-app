import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import API from './AuthService';

dayjs.extend(utc);

const API_URL = 'http://localhost:8000/api/auth';

export interface User {
    id: number;
    email: string;
    date_of_birth: Date | null;
    first_name: string;
    last_name: string;
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

export interface Doctor extends User {
    base_role: 'DOCTOR';
    // additional fields...
}

export interface DoctorProfile {
    user: Doctor;
    user_id: number;
    specialty:
        | 'GENERAL_DOCTOR'
        | 'CARDIOLOGIST'
        | 'ORTHOPEDIST'
        | 'NEUROLOGIST'
        | 'PSYCHIATRIST'
        | 'PEDIATRICIAN'
        | null;
    location: string | null;
    phone_number: string | null;
    fax_number: string | null;
    languages: string | null;
    schedule: Date[] | string[]; // Allow both types
    medical_school: string | null;
    residency_program: string | null;
    img_url: string | null;
}

export const specialtyMap = {
    GENERAL_DOCTOR: 'General Doctor',
    CARDIOLOGIST: 'Cardiologist',
    ORTHOPEDIST: 'Orthopedist',
    NEUROLOGIST: 'Neurologist',
    PSYCHIATRIST: 'Psychiatrist',
    PEDIATRICIAN: 'Pediatrician',
};

// Utility: Format schedule dates
const formatScheduleDates = (schedule: Date[] | string[]): string[] => {
    return schedule
        .map((date) => (typeof date === 'string' ? date : date.toISOString()))
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
};

// Fetch all doctors
export const getDoctors = async (): Promise<Doctor[]> => {
    const response = await API.get<Doctor[]>(`${API_URL}/doctor/`);
    return response.data;
};

// Fetch all doctor profiles
export const getDoctorProfiles = async (): Promise<DoctorProfile[]> => {
    const response = await API.get<DoctorProfile[]>(`${API_URL}/doctor-profiles/`);
    return response.data;
};

// Utility: Transform array to map
const arrayToMap = <T extends { id: number }>(array: T[]): { [key: number]: T } => {
    return array.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {} as { [key: number]: T });
};

export const getDoctorsMap = async (): Promise<{ [key: number]: Doctor }> => {
//   console.log("Fetching Doctors with Authorization Header");
  const response = await API.get<Doctor[]>('/doctor/');
  return arrayToMap(response.data); // Assuming `arrayToMap` is a utility function
};

// Utility: Transform array to map by key
const arrayToMapByKey = <T, K extends keyof T>(
    array: T[],
    key: K
  ): { [key: string]: T } => {
    return array.reduce((acc, item) => {
      const keyValue = item[key];
      if (keyValue !== undefined && keyValue !== null) {
        acc[keyValue as unknown as string] = item; // Ensure key is stringified
      }
      return acc;
    }, {} as { [key: string]: T });
  };
  

  export const getDoctorProfilesMap = async (): Promise<{ [key: number]: DoctorProfile }> => {
    try {
      const profilesArray = await getDoctorProfiles();
    //   console.log("Profiles Array:", profilesArray);
  
      // Use `arrayToMapByKey` with the `user` key
      const profilesMap = arrayToMapByKey(profilesArray, "user");
    //   console.log("Profiles Map:", profilesMap);
  
      return profilesMap;
    } catch (error) {
      console.error("Failed to fetch doctor profiles map:", error);
      return {};
    }
  };
  



// Fetch a single doctor
export const getDoctor = async (id: number): Promise<Doctor | null> => {
    try {
        const doctorsMap = await getDoctorsMap();
        return doctorsMap[id] || null;
    } catch (error) {
        console.error(`Failed to fetch doctor with id ${id}:`, error);
        return null;
    }
};

// Fetch a single doctor profile
export const getDoctorProfile = async (user_id: number): Promise<DoctorProfile | null> => {
    try {
        const profilesMap = await getDoctorProfilesMap();
        return profilesMap[user_id] || null;
    } catch (error) {
        console.error(`Failed to fetch doctor profile with user_id ${user_id}:`, error);
        return null;
    }
};

// Create a doctor
export const createDoctor = async (id: number, doctor: Doctor): Promise<Doctor> => {
    const response = await API.post<Doctor>(`${API_URL}/doctor/${id}/`, doctor);
    return response.data;
};

// Create a doctor profile
export const createDoctorProfile = async (user_id: number, profile: Partial<DoctorProfile>): Promise<DoctorProfile> => {
    const formattedProfile = { ...profile, schedule: formatScheduleDates(profile.schedule || []) };
    const response = await API.post<DoctorProfile>(`${API_URL}/doctor-profiles/${user_id}/`, formattedProfile);
    return response.data;
};

// Update a doctor
export const updateDoctor = async (id: number, doctor: Partial<Doctor>): Promise<Doctor> => {
    const response = await API.patch<Doctor>(`${API_URL}/doctor/${id}/`, doctor);
    return response.data;
};

// Update a doctor profile
export const updateDoctorProfile = async (user_id: number, profile: Partial<DoctorProfile>): Promise<DoctorProfile> => {
    const formattedProfile = { ...profile, schedule: formatScheduleDates(profile.schedule || []) };
    const response = await API.patch<DoctorProfile>(`${API_URL}/doctor-profiles/${user_id}/`, formattedProfile);
    return response.data;
};

// Delete a doctor profile
export const deleteDoctorProfile = async (user_id: number): Promise<void> => {
    await API.delete(`${API_URL}/doctor-profiles/${user_id}/`);
};

// Get booked slots for a doctor
export const getBookedSlots = async (doctorProfileId: string): Promise<string[]> => {
    const response = await API.get<string[]>(`${API_URL}/doctor-profiles/${doctorProfileId}/booked-slots/`);
    return response.data;
};

// Helper to format dates to ISO-8601 UTC
const formatToUTC = (date: string | Date): string => {
    return dayjs(date).utc().format();
};

// Add a schedule date to a doctor profile
export const addScheduleDate = async (doctorId: number, dateToAdd: string | Date): Promise<void> => {
    const formattedDate = formatToUTC(dateToAdd);
    try {
        const response = await API.patch(`/doctor-profiles/${doctorId}/add-schedule-date/`, { date: formattedDate });
        // console.log(`Added schedule date for doctor ${doctorId}: ${formattedDate}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to add schedule date for doctor ${doctorId}:`, error);
        throw error;
    }
};

// Remove a schedule date from a doctor profile
export const removeScheduleDate = async (doctorId: number, dateToRemove: string | Date): Promise<void> => {
    const formattedDate = formatToUTC(dateToRemove);
    try {
        const response = await API.patch(`/doctor-profiles/${doctorId}/remove-schedule-date/`, { date: formattedDate });
        // console.log(`Removed schedule date for doctor ${doctorId}: ${formattedDate}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to remove schedule date for doctor ${doctorId}:`, error);
        throw error;
    }
};
