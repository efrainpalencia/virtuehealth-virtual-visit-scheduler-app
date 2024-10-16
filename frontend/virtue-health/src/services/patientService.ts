import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;

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
    // any additional fields or methods specific to Patient
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

export const getPatients = async (): Promise<Patient[]> => {
    const response = await axios.get<Patient[]>(`${API_URL }/patient/`);
    return response.data;
};

export const getPatientProfiles = async (): Promise<PatientProfile[]> => {
    const response = await axios.get<PatientProfile[]>(`${API_URL}/patient-profiles/`);
    return response.data;
};


// Utility functions to transform data into hash maps
export const getPatientsMap = async (): Promise<{ [key: number]: Patient }> => {
    const patientsArray = await getPatients();
    const patientsMap = patientsArray.reduce((acc: { [key: number]: Patient }, patient: Patient) => {
        acc[patient.id] = patient;
        return acc;
    }, {});
    return patientsMap;
};

export const getPatientProfilesMap = async (): Promise<{ [key: number]: PatientProfile }> => {
    const profilesArray = await getPatientProfiles();
    const profilesMap = profilesArray.reduce((acc: { [key: number]: PatientProfile }, profile: PatientProfile) => {
        acc[profile.user] = profile;
        return acc;
    }, {});
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
  export const getPatientProfile = async (user: number): Promise<PatientProfile | null> => {
    try {
      const profilesMap = await getPatientProfilesMap();
      return profilesMap[user] || null;
    } catch (error) {
      console.error(`Failed to fetch patient profile with id ${user}:`, error);
      return null;
    }
    
  };
  
  // Create a new patient and return the updated profile
  export const createPatient = async (id: number, patient: Patient): Promise<Patient> => {
    try {
      const response = await axios.post<Patient>(`${API_URL }/patient/${id}/`, patient);
    return response.data;
    } catch (error) {
      console.error(`Failed to create patient`, error);
      return error;
    }
    
  };

  // Create a new patient profile and return the updated profile
  export const createPatientProfile = async (user_id: number, profile: Partial<PatientProfile>,): Promise<PatientProfile> => {
    const response = await axios.post<PatientProfile>(`${API_URL}/patient-profiles/${user_id}/`, profile);
    return response.data; // Newly created profile returned from the server
  };
  
  // Update an existing patient profile
  export const updatePatient = async (
    id: number,
    patient: Partial<Patient>
  ): Promise<Patient> => {
    try {
      const response = await axios.patch<Patient>(`${API_URL}/patient/${id}/`, patient);
    return response.data;
    } catch (error) {
      console.error(`Failed to update patient`, error);
      return error;
    }
    
  };

  export const updatePatientProfile = async (
    user_id: number,
    profile: Partial<PatientProfile>
  ): Promise<PatientProfile> => {
    try {
      const response = await axios.patch<PatientProfile>(`${API_URL}/patient-profiles/${user_id}/`, profile);
    return response.data;
    } catch (error) {
      console.error(`Failed to update patient profile`, error);
      return error;
    }
    
  };
  
  // Delete a patient profile
  export const deletePatientProfile = async (user_id: number): Promise<void> => {
    await axios.delete(`${API_URL}/patient-profiles/${user_id}/`);
  };
