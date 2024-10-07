// services/patientService.ts
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
    user: User;
    patient_id: number | null;
    race_ethnicity: 'WHITE' | 'BLACK' | 'HISPANIC_LATINO' | 'ASIAN' | 'AMERICAN_INDIAN_NATIVE_ALASKAN' | 'NATIVE_HAWAIIAN_PACIFIC_ISLANDER' | null;
    address: string | null;
    phone_number: string | null;
    insurance_provider: string | null;
    medical_record: MedicalRecord | null;
}


export const getPatients = async (): Promise<Patient[]> => {
    const response = await axios.get<Patient[]>(`${API_URL}/patients/`);
    return response.data;
};

export const getPatientProfiles = async (): Promise<PatientProfile[]> => {
    const response = await axios.get<PatientProfile[]>(`${API_URL}/patient-profiles/`);
    return response.data;
};

// Other CRUD functions for both Patient and PatientProfile...
