import axios from 'axios';

const API_URL = 'http://localhost:8000';

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
    doctor_id: number | null;
    specialty: 'GENERAL_DOCTOR' | 'CARDIOLOGIST' | 'ORTHOPEDIST' | 'NEUROLIGIST' | 'PSYCHIATRIST' | 'PEDIATRICIAN' | null;
    location: string | null;
    phone_number: string | null;
    fax_number: string | null;
    languages: string | null;
    schedule: Date[];
}

export const getDoctors = async (): Promise<Doctor[]> => {
    const response = await axios.get<Doctor[]>(`${API_URL}/auth/doctor/`);
    return response.data;
};

export const getDoctorProfiles = async (): Promise<DoctorProfile[]> => {
    const response = await axios.get<DoctorProfile[]>(`${API_URL}/doctor-profiles/`);
    return response.data;
};
