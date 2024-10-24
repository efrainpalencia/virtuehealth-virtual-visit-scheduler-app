import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

export interface User {
    id: number;
    email: string;
    date_of_birth: Date| null;
    first_name: string;
    last_name: string;
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

export interface Doctor extends User {
    base_role: 'DOCTOR'
    // other fields...
}

export interface DoctorProfile {
    user: Doctor;
    user_id: number;
    specialty: 'GENERAL_DOCTOR' | 'CARDIOLOGIST' | 'ORTHOPEDIST' | 'NEUROLIGIST' | 'PSYCHIATRIST' | 'PEDIATRICIAN' | null;
    location: string | null;
    phone_number: string | null;
    fax_number: string | null;
    languages: string | null;
    schedule: Date[];
    medical_school: string | null;
    residency_program: string | null;
    img_url: string | null;
}

export const getDoctors = async (): Promise<Doctor[]> => {
    const response = await axios.get<Doctor[]>(`${API_URL }/doctor/`);
    return response.data;
};

export const getDoctorProfiles = async (): Promise<DoctorProfile[]> => {
    const response = await axios.get<DoctorProfile[]>(`${API_URL}/doctor-profiles/`);
    return response.data;
};


// Utility functions to transform data into hash maps
export const getDoctorsMap = async (): Promise<{ [key: number]: Doctor }> => {
    const doctorsArray = await getDoctors();
    const doctorsMap = doctorsArray.reduce((acc: { [key: number]: Doctor }, doctor: Doctor) => {
        acc[doctor.id] = doctor;
        return acc;
    }, {});
    return doctorsMap;
};

export const getDoctorProfilesMap = async (): Promise<{ [key: number]: DoctorProfile }> => {
    const profilesArray = await getDoctorProfiles();
    const profilesMap = profilesArray.reduce((acc: { [key: number]: DoctorProfile }, profile: DoctorProfile) => {
        acc[profile.user] = profile;
        return acc;
    }, {});
    return profilesMap;

};

// Get a single patient from the hash map by id
export const getDoctor = async (id: number): Promise<Doctor | null> => {
  try {
    const doctorsMap = await getDoctorsMap();
    return doctorsMap[id] || null;
  } catch (error) {
    console.error(`Failed to fetch doctor with id ${id}:`, error);
    return null;
  }
};

  
  // Get a single patient profile from the hash map by user_id
  export const getDoctorProfile = async (user: number): Promise<DoctorProfile | null> => {
    try {
      const profilesMap = await getDoctorProfilesMap();
      return profilesMap[user] || null;
    } catch (error) {
      console.error(`Failed to fetch doctor profile with id ${user}:`, error);
      return null;
    }
    
  };
  
  // Create a new patient and return the updated profile
  export const createDoctor = async (id: number, doctor: Doctor): Promise<Doctor> => {
    try {
      const response = await axios.post<Doctor>(`${API_URL }/doctor/${id}/`, doctor);
    return response.data;
    } catch (error) {
      console.error(`Failed to create doctor`, error);
      return error;
    }
    
  };

  // Create a new patient profile and return the updated profile
  export const createDoctorProfile = async (user_id: number, profile: Partial<DoctorProfile>,): Promise<DoctorProfile> => {
    const response = await axios.post<DoctorProfile>(`${API_URL}/doctor-profiles/${user_id}/`, profile);
    return response.data; // Newly created profile returned from the server
  };
  
  // Update an existing patient profile
  export const updateDoctor = async (
    id: number,
    doctor: Partial<Doctor>
  ): Promise<Doctor> => {
    try {
      const response = await axios.patch<Doctor>(`${API_URL}/doctor/${id}/, doctor`);
    return response.data;
    } catch (error) {
      console.error(`Failed to update doctor`, error);
      return error;
    }
    
  };

  export const updateDoctorProfile = async (
    user_id: number,
    profile: Partial<DoctorProfile>
  ): Promise<DoctorProfile> => {
    try {
      const response = await axios.patch<DoctorProfile>(`${API_URL}/doctor-profiles/${user_id}/`, profile);
    return response.data;
    } catch (error) {
      console.error(`Failed to update doctor profile`, error);
      return error;
    }
    
  };
  
  // Delete a patient profile
  export const deleteDoctorProfile = async (user_id: number): Promise<void> => {
    await axios.delete(`${API_URL}/doctor-profiles/${user_id}/`);
  };