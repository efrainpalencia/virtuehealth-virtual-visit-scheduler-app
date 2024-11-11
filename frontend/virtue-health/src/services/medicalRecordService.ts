import axios from 'axios';
import { getIdFromToken } from './authService';

const API_BASE_URL = 'http://localhost:8000/api/medical-records/view-medical-records';

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

// Fetch the medical record for the current patient or by patient ID (for doctors)
export const getMedicalRecord = async (patientProfileId?: number): Promise<MedicalRecord> => {
  try {
    const id = patientProfileId ?? getIdFromToken(localStorage.getItem("access_token") || "");
    const url = id
      ? `${API_BASE_URL}?patient_id=${id}`
      : `${API_BASE_URL}`;
    const response = await axios.get<MedicalRecord>(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching medical record:", error.response?.data || error.message);
    throw error;
  }
};

// Create a new medical record only if one does not exist
export const createMedicalRecord = async (
  recordData: MedicalRecord
): Promise<MedicalRecord> => {
  try {
    const existingRecord = await getMedicalRecord(recordData.patient);
    if (existingRecord) {
      throw new Error("A medical record already exists for this patient.");
    }
    const response = await axios.post<MedicalRecord>(API_BASE_URL, recordData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating medical record:", error.response?.data || error.message);
    throw error;
  }
};

// Update an existing medical record by record ID
export const updateMedicalRecord = async (
  recordId: number,
  recordData: Partial<MedicalRecord>
): Promise<MedicalRecord> => {
  try {
    const response = await axios.patch<MedicalRecord>(
      `${API_BASE_URL}/${recordId}/`,
      recordData,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating medical record:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a medical record by record ID
export const deleteMedicalRecord = async (recordId: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${recordId}/`);
  } catch (error: any) {
    console.error("Error deleting medical record:", error.response?.data || error.message);
    throw error;
  }
};
