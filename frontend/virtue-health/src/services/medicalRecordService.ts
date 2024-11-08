import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/patient-portal';

export interface MedicalRecord {
  id?: number;
  patient: number;
  height?: number;
  weight?: number;
  physical_activity?: string;
  psychological_assessment?: string;
  drugs_alcohol?: string;
  medical_condition?: string;
  injury_illness?: string;
  family_history?: string;
  treatment_surgery?: string;
  current_medication?: string;
  allergy?: string;
  side_effects?: string;
}

// Fetch the medical record of a patient by their profile ID
export const getMedicalRecord = async (patientProfileId: number): Promise<MedicalRecord> => {
  try {
    const response = await axios.get<MedicalRecord>(`${API_BASE_URL}/${patientProfileId}/medical-record/`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching medical record:", error.response?.data || error.message);
    throw error;
  }
};

// Create a new medical record for a patient
export const createMedicalRecord = async (patientProfileId: number, recordData: MedicalRecord): Promise<MedicalRecord> => {
  try {
    const response = await axios.post<MedicalRecord>(`${API_BASE_URL}/${patientProfileId}/medical-record/`, recordData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating medical record:", error.response?.data || error.message);
    throw error;
  }
};

// Update an existing medical record by record ID
export const updateMedicalRecord = async (patientProfileId: number, recordData: Partial<MedicalRecord>): Promise<MedicalRecord> => {
  try {
    const response = await axios.patch<MedicalRecord>(`${API_BASE_URL}/${patientProfileId}/medical-record/`, recordData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error updating medical record:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a medical record by record ID
export const deleteMedicalRecord = async (patientProfileId: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${patientProfileId}/medical-record/`);
  } catch (error: any) {
    console.error("Error deleting medical record:", error.response?.data || error.message);
    throw error;
  }
};
