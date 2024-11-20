import API from './AuthService'; // Import the configured Axios instance

const API_URL = 'http://localhost:8000/api/auth';

export interface User {
    id: number;
    email: string;
    date_of_birth: Date | null;
    first_name: string;
    last_name: string;
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

export interface MedicalRecord {
    id: number;
    height: number | null;
    weight: number | null;
    physical_activity: string | null;
    psychological_assessment: string | null;
    drugs_alcohol: string | null;
    medical_condition: string | null;
    injury_illness: string | null;
    family_history: string | null;
    treatment_surgery: string | null;
    current_medication: string | null;
    allergy: string | null;
    side_effects: string | null;
}

export interface Patient extends User {
    base_role: 'PATIENT';
    // Additional fields or methods specific to Patient
}

export interface PatientProfile {
    user: Patient;
    user_id: number;
    race_ethnicity: 'WHITE' | 'BLACK' | 'HISPANIC_LATINO' | 'ASIAN' | 'AMERICAN_INDIAN_NATIVE_ALASKAN' | 'NATIVE_HAWAIIAN_PACIFIC_ISLANDER' | null;
    gender: 'MALE' | 'FEMALE' | null;
    address: string | null;
    phone_number: string | null;
    insurance_provider: string | null;
    medical_record: MedicalRecord | null;
    img_url: string | null;
    emergency_name: string | null;
    emergency_contact: string | null;
    emergency_relationship: string | null;
}

// Fetch all patients
export const getPatients = async (): Promise<Patient[]> => {
    const response = await API.get<Patient[]>(`${API_URL}/patient/`);
    return response.data;
};

// Fetch all patient profiles
export const getPatientProfiles = async (): Promise<PatientProfile[]> => {
    const response = await API.get<PatientProfile[]>(`${API_URL}/patient-profiles/`);
    return response.data;
};

// Utility functions to transform data into hash maps
export const getPatientsMap = async (): Promise<{ [key: number]: Patient }> => {
    const patientsArray = await getPatients();
    return patientsArray.reduce((acc: { [key: number]: Patient }, patient: Patient) => {
        acc[patient.id] = patient;
        return acc;
    }, {});
};

// Utility: Transform array to map by key
const arrayToMapByKey = <T, K extends keyof T>(
    array: T[],
    key: K
  ): { [key: number]: T } => {
    return array.reduce((acc, item) => {
      const keyValue = item[key];
      if (keyValue !== undefined && keyValue !== null) {
        acc[keyValue as unknown as number] = item; // Ensure the key is a number
      }
      return acc;
    }, {} as { [key: number]: T });
  };

// Use the updated utility for Patient Profiles Map
export const getPatientProfilesMap = async (): Promise<{ [key: number]: PatientProfile }> => {
    const profilesArray = await getPatientProfiles();
    console.log("Profiles Array:", profilesArray);
  
    // Use `arrayToMapByKey` with the `user` key
    const profilesMap = arrayToMapByKey(profilesArray, "user");
    console.log("Profiles Map:", profilesMap);
  
    return profilesMap;
  };

// Get a single patient from the hash map by id
export const getPatient = async (id: number): Promise<Patient | null> => {
    try {
        const patientsMap = await getPatientsMap();
        return patientsMap[id] || null;
    } catch (error) {
        console.error(`Failed to fetch patient with id ${id}:`, error);
        return null;
    }
};

// Get a single patient profile from the hash map by user_id
export const getPatientProfile = async (user_id: number): Promise<PatientProfile | null> => {
    try {
      const profilesMap = await getPatientProfilesMap();
      console.log("Fetched Profiles Map:", profilesMap); // Debug log
      return profilesMap[user_id] || null;
    } catch (error) {
      console.error(`Failed to fetch patient profile with user_id ${user_id}:`, error);
      return null;
    }
  };
  

// Create a new patient
export const createPatient = async (id: number, patient: Patient): Promise<Patient> => {
    try {
        const response = await API.post<Patient>(`${API_URL}/patient/${id}/`, patient);
        return response.data;
    } catch (error) {
        console.error(`Failed to create patient`, error);
        throw error;
    }
};

// Create a new patient profile
export const createPatientProfile = async (
    user_id: number,
    profile: Partial<PatientProfile>
): Promise<PatientProfile> => {
    try {
        const response = await API.post<PatientProfile>(`${API_URL}/patient-profiles/${user_id}/`, profile);
        return response.data;
    } catch (error) {
        console.error(`Failed to create patient profile`, error);
        throw error;
    }
};

// Update an existing patient
export const updatePatient = async (
    id: number,
    patient: Partial<Patient>
): Promise<Patient> => {
    try {
        const response = await API.patch<Patient>(`${API_URL}/patient/${id}/`, patient);
        return response.data;
    } catch (error) {
        console.error(`Failed to update patient`, error);
        throw error;
    }
};

// Update an existing patient profile
export const updatePatientProfile = async (
    user_id: number,
    profile: Partial<PatientProfile>
): Promise<PatientProfile> => {
    try {
        const response = await API.patch<PatientProfile>(`${API_URL}/patient-profiles/${user_id}/`, profile);
        return response.data;
    } catch (error) {
        console.error(`Failed to update patient profile`, error);
        throw error;
    }
};

// Delete a patient profile
export const deletePatientProfile = async (user_id: number): Promise<void> => {
    try {
        await API.delete(`${API_URL}/patient-profiles/${user_id}/`);
    } catch (error) {
        console.error(`Failed to delete patient profile with id ${user_id}:`, error);
        throw error;
    }
};
