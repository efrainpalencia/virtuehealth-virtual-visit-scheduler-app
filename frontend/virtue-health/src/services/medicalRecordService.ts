import axios from 'axios';
import { getAccessToken, getIdFromToken } from './authService';


// Production
const API_BASE_URL = 'http://184.72.127.33:8000/api/medical-records/view-medical-records/';

// Development
// const API_BASE_URL = 'http://localhost:8000/api/medical-records/view-medical-records/';

export interface MedicalRecord {
  id?: number;
  patient?: number;
  height?: number;
  weight?: number;
  physical_activity?: 'NONE' | 'ONE_TO_THREE_DAYS' | 'THREE_OR_MORE_DAYS';
  psychological_assessment?:
    | 'NONE'
    | 'OBSESSIVE_COMPULSIVE_DISORDER'
    | 'PANIC_DISORDER'
    | 'SOCIAL_ANXIETY_DISORDER'
    | 'BIPOLAR_DISORDER'
    | 'SCHIZOID_PERSONALITY_DISORDER'
    | 'BINGE_EATING_DISORDER'
    | 'PICA'
    | 'OTHER';
  drugs_alcohol?:
    | 'NONE'
    | 'ALCOHOL'
    | 'CANNABIS'
    | 'COCAINE'
    | 'FENTANYL'
    | 'HALLUCINOGINS'
    | 'HEROIN'
    | 'KETAMINE'
    | 'METHAMPHETAMINE'
    | 'OXYCONTIN'
    | 'TOBACCO'
    | 'OTHER';
  medical_condition?:
  | 'NONE' 
  | 'HYPERLIPIDEMIA'
  | 'LOW_BACK_PAIN'
  | 'GASTROESOPHAGEAL_REFLUX_DISORDER'
  | 'URINARY_TRACT_INFECTION'
  | 'CHEST_PAIN'
  | 'HYPOTHYROIDISM'
  | 'ACUTE_BRONCHITIS'
  | 'TYPE_II_DIABETES_MELLITUS_WITHOUT_COMPLICATIONS'
  | 'PAIN_IN_UNSPECIFIED_LIMB'
  | 'OTHER';
  injury_illness?:
    | 'NONE'
    | 'SPRAIN_STRAIN'
    | 'KNEE_INJURY'
    | 'SWOLLEN_MUSCLES'
    | 'ACHILLES_INJURY'
    | 'ROTATOR_CUFF_INJURY'
    | 'FRACTURE'
    | 'DISLOCATION'
    | 'OTHER';
  family_history?:
    | 'HEART_DISEASE'
    | 'DIABETES'
    | 'KIDNEY_DISEASE'
    | 'BLEEDING_DISEASE'
    | 'LUNG_DISEASE'
    | 'HIGH_BLOOD_PRESSURE'
    | 'HIGH_CHOLESTEROL'
    | 'ASTHMA'
    | 'CANCER'
    | 'STROKE'
    | 'ALZHEIMERS_DEMENTIA'
    | 'OTHER';
  treatment_surgery?:
    | 'NONE'
    | 'APPENDECTOMY'
    | 'BREAST_BIOPSY'
    | 'CATARACT_SURGERY'
    | 'CESAREAN_SECTION'
    | 'CORONARY_ARTERTY_BYPASS'
    | 'HYSTERECTOMY'
    | 'LOW_BACK_PAIN_SURGERY'
    | 'MASTECTOMY'
    | 'PROSTECTOMY'
    | 'OTHER';
  current_medication?:
    | 'NONE'
    | 'ATORVASTATIN'
    | 'METFORMIN'
    | 'LISINOPRIL'
    | 'LEVOTHROXINE'
    | 'AMLODIPINE'
    | 'METOPROLOL'
    | 'ALBUTEROL'
    | 'OTHER';
  allergy?:
    | 'NONE'
    | 'FISH'
    | 'SHELLFISH'
    | 'TREE_NUTS'
    | 'PEANUTS'
    | 'DAIRY'
    | 'EGGS'
    | 'ANTIBIOTICS'
    | 'ASPIRIN'
    | 'CHEMOTHERAPY_MEDICATIONS'
    | 'ANTICONVULSANTS'
    | 'OTHER';
  side_effects?: 'NONE' | 'NAUSEA' | 'SKIN_IRRITATION' | 'DRY_MOUTH' | 'DROWSINESS' | 'OTHER';
}

// Use to display values
export const physicalActivityMap = {
  NONE: "None",
  ONE_TO_THREE_DAYS: "One to Three Days",
  THREE_OR_MORE_DAYS: "Three or More Days",
};

export const psychologicalAssessmentMap = {
  NONE: "None",
  OBSESSIVE_COMPULSIVE_DISORDER: "Obsessive-compulsive Disorder",
  PANIC_DISORDER: "Panic Disorder",
  SOCIAL_ANXIETY_DISORDER: "Social Anxiety Disorder",
  BIPOLAR_DISORDER: "Bipolar Disorder",
  SCHIZOID_PERSONALITY_DISORDER: "Schizoid Personality Disorder",
  BINGE_EATING_DISORDER: "Binge Eating Disorder",
  PICA: "Pica",
  OTHER: "Other",
};

export const drugsAlcoholMap = {
  NONE: "None",
  ALCOHOL: "Alcohol",
  CANNABIS: "Cannabis",
  COCAINE: "Cocaine",
  FENTANYL: "Fentanyl",
  HALLUCINOGINS: "Hallucinogens",
  HEROIN: "Heroin",
  KETAMINE: "Ketamine",
  METHAMPHETAMINE: "Methamphetamine",
  OXYCONTIN: "Oxycontin",
  TOBACCO: "Tobacco",
  OTHER: "Other",
};

export const medicalConditionMap = {
  NONE: "None",
  HYPERLIPIDEMIA: "Hyperlipidemia",
  LOW_BACK_PAIN: "Low back pain",
  GASTROESOPHAGEAL_REFLUX_DISORDER: "Gastroesophageal reflux disorder",
  URINARY_TRACT_INFECTION: "Urinary tract infection",
  CHEST_PAIN: "Chest pain",
  HYPOTHYROIDISM: "Hypothyroidism",
  ACUTE_BRONCHITIS: "Acute bronchitis",
  TYPE_II_DIABETES_MELLITUS_WITHOUT_COMPLICATIONS: "Type II diabetes mellitus without complications",
  PAIN_IN_UNSPECIFIED_LIMB: "Pain in unspecified limb",
  OTHER: "Other",
};

export const injuryIllnessMap = {
  NONE: "None",
  SPRAIN_STRAIN: "Sprain/strain",
  KNEE_INJURY: "Knee injury",
  SWOLLEN_MUSCLES: "Swollen muscles",
  ACHILLES_INJURY: "Achilles injury",
  ROTATOR_CUFF_INJURY: "Rotator cuff injury",
  FRACTURE: "Fracture",
  DISLOCATION: "Dislocation",
  OTHER: "Other",
};

export const familyHistoryMap = {
  HEART_DISEASE: "Heart disease",
  DIABETES: "Diabetes",
  KIDNEY_DISEASE: "Kidney disease",
  BLEEDING_DISEASE: "Bleeding disease",
  LUNG_DISEASE: "Lung disease",
  HIGH_BLOOD_PRESSURE: "High blood pressure",
  HIGH_CHOLESTEROL: "High cholesterol",
  ASTHMA: "Asthma",
  CANCER: "Cancer",
  STROKE: "Stroke",
  ALZHEIMERS_DEMENTIA: "Alzheimer's/Dementia",
  OTHER: "Other",
};

export const treatmentSurgeryMap = {
  NONE: "None",
  APPENDECTOMY: "Appendectomy",
  BREAST_BIOPSY: "Breast biopsy",
  CATARACT_SURGERY: "Cataract surgery",
  CESAREAN_SECTION: "Cesarean section",
  CORONARY_ARTERTY_BYPASS: "Coronary artery bypass",
  HYSTERECTOMY: "Hysterectomy",
  LOW_BACK_PAIN_SURGERY: "Low back pain surgery",
  MASTECTOMY: "Mastectomy",
  PROSTECTOMY: "Prostectomy",
  OTHER: "Other",
};

export const currentMedicationMap = {
  NONE: "None",
  ATORVASTATIN: "Atorvastatin",
  METFORMIN: "Metformin",
  LISINOPRIL: "Lisinopril",
  LEVOTHROXINE: "Levothroxine",
  AMLODIPINE: "Amlodipine",
  METOPROLOL: "Metoprolol",
  ALBUTEROL: "Albuterol",
  OTHER: "Other",
};

export const allergyMap = {
  NONE: "None",
  FISH: "Fish",
  SHELLFISH: "Shellfish",
  TREE_NUTS: "Tree nuts",
  PEANUTS: "Peanuts",
  DAIRY: "Dairy",
  EGGS: "Eggs",
  ANTIBIOTICS: "Antibiotics",
  ASPIRIN: "Aspirin",
  CHEMOTHERAPY_MEDICATIONS: "Chemotherapy medications",
  ANTICONVULSANTS: "Anticonvulsants",
  OTHER: "Other",
};

export const sideEffectsMap = {
  NONE: "None",
  NAUSEA: "Nausea",
  SKIN_IRRITATION: "Skin irritation",
  DRY_MOUTH: "Dry mouth",
  DROWSINESS: "Drowsiness",
  OTHER: "Other",
};

// Use to fill out forms
export const selectPhysicalActivityMap = [
  { value: "NONE", label: "None" },
  { value: "ONE_TO_THREE_DAYS", label: "One to Three Days" },
  { value: "THREE_OR_MORE_DAYS", label: "Three or More Days" },
];

export const selectPsychologicalAssessmentMap = [
  { value: "NONE", label: "None" },
  { value: "OBSESSIVE_COMPULSIVE_DISORDER", label: "Obsessive-compulsive Disorder" },
  { value: "PANIC_DISORDER", label: "Panic Disorder" },
  { value: "SOCIAL_ANXIETY_DISORDER", label: "Social Anxiety Disorder" },
  { value: "BIPOLAR_DISORDER", label: "Bipolar Disorder" },
  { value: "SCHIZOID_PERSONALITY_DISORDER", label: "Schizoid Personality Disorder" },
  { value: "BINGE_EATING_DISORDER", label: "Binge Eating Disorder" },
  { value: "PICA", label: "Pica" },
  { value: "OTHER", label: "Other" },
];

export const selectDrugsAlcoholMap = [
  { value: "NONE", label: "None" },
  { value: "ALCOHOL", label: "Alcohol" },
  { value: "CANNABIS", label: "Cannabis" },
  { value: "COCAINE", label: "Cocaine" },
  { value: "FENTANYL", label: "Fentanyl" },
  { value: "HALLUCINOGINS", label: "Hallucinogens" },
  { value: "HEROIN", label: "Heroin" },
  { value: "KETAMINE", label: "Ketamine" },
  { value: "METHAMPHETAMINE", label: "Methamphetamine" },
  { value: "OXYCONTIN", label: "Oxycontin" },
  { value: "TOBACCO", label: "Tobacco" },
  { value: "OTHER", label: "Other" },
];

export const selectMedicalConditionMap = [
  { value: "NONE", label: "None" },
  { value: "HYPERLIPIDEMIA", label: "Hyperlipidemia" },
  { value: "LOW_BACK_PAIN", label: "Low back pain" },
  { value: "GASTROESOPHAGEAL_REFLUX_DISORDER", label: "Gastroesophageal reflux disorder" },
  { value: "URINARY_TRACT_INFECTION", label: "Urinary tract infection" },
  { value: "CHEST_PAIN", label: "Chest pain" },
  { value: "HYPOTHYROIDISM", label: "Hypothyroidism" },
  { value: "ACUTE_BRONCHITIS", label: "Acute bronchitis" },
  { value: "TYPE_II_DIABETES_MELLITUS_WITHOUT_COMPLICATIONS", label: "Type II diabetes mellitus without complications" },
  { value: "PAIN_IN_UNSPECIFIED_LIMB", label: "Pain in unspecified limb" },
  { value: "OTHER", label: "Other" },
];

export const selectInjuryIllnessMap = [
  { value: "NONE", label: "None" },
  { value: "SPRAIN_STRAIN", label: "Sprain/strain" },
  { value: "KNEE_INJURY", label: "Knee injury" },
  { value: "SWOLLEN_MUSCLES", label: "Swollen muscles" },
  { value: "ACHILLES_INJURY", label: "Achilles injury" },
  { value: "ROTATOR_CUFF_INJURY", label: "Rotator cuff injury" },
  { value: "FRACTURE", label: "Fracture" },
  { value: "DISLOCATION", label: "Dislocation" },
  { value: "OTHER", label: "Other" },
];

export const selectFamilyHistoryMap = [
  { value: "HEART_DISEASE", label: "Heart disease" },
  { value: "DIABETES", label: "Diabetes" },
  { value: "KIDNEY_DISEASE", label: "Kidney disease" },
  { value: "BLEEDING_DISEASE", label: "Bleeding disease" },
  { value: "LUNG_DISEASE", label: "Lung disease" },
  { value: "HIGH_BLOOD_PRESSURE", label: "High blood pressure" },
  { value: "HIGH_CHOLESTEROL", label: "High cholesterol" },
  { value: "ASTHMA", label: "Asthma" },
  { value: "CANCER", label: "Cancer" },
  { value: "STROKE", label: "Stroke" },
  { value: "ALZHEIMERS_DEMENTIA", label: "Alzheimer's/Dementia" },
  { value: "OTHER", label: "Other" },
];

export const selectTreatmentSurgeryMap = [
  { value: "NONE", label: "None" },
  { value: "APPENDECTOMY", label: "Appendectomy" },
  { value: "BREAST_BIOPSY", label: "Breast biopsy" },
  { value: "CATARACT_SURGERY", label: "Cataract surgery" },
  { value: "CESAREAN_SECTION", label: "Cesarean section" },
  { value: "CORONARY_ARTERTY_BYPASS", label: "Coronary artery bypass" },
  { value: "HYSTERECTOMY", label: "Hysterectomy" },
  { value: "LOW_BACK_PAIN_SURGERY", label: "Low back pain surgery" },
  { value: "MASTECTOMY", label: "Mastectomy" },
  { value: "PROSTECTOMY", label: "Prostectomy" },
  { value: "OTHER", label: "Other" },
];

export const selectCurrentMedicationMap = [
  { value: "NONE", label: "None" },
  { value: "ATORVASTATIN", label: "Atorvastatin" },
  { value: "METFORMIN", label: "Metformin" },
  { value: "LISINOPRIL", label: "Lisinopril" },
  { value: "LEVOTHROXINE", label: "Levothroxine" },
  { value: "AMLODIPINE", label: "Amlodipine" },
  { value: "METOPROLOL", label: "Metoprolol" },
  { value: "ALBUTEROL", label: "Albuterol" },
  { value: "OTHER", label: "Other" },
];

export const selectAllergyMap = [
  { value: "NONE", label: "None" },
  { value: "FISH", label: "Fish" },
  { value: "SHELLFISH", label: "Shellfish" },
  { value: "TREE_NUTS", label: "Tree nuts" },
  { value: "PEANUTS", label: "Peanuts" },
  { value: "DAIRY", label: "Dairy" },
  { value: "EGGS", label: "Eggs" },
  { value: "ANTIBIOTICS", label: "Antibiotics" },
  { value: "ASPIRIN", label: "Aspirin" },
  { value: "CHEMOTHERAPY_MEDICATIONS", label: "Chemotherapy medications" },
  { value: "ANTICONVULSANTS", label: "Anticonvulsants" },
  { value: "OTHER", label: "Other" },
];

export const selectSideEffectsMap = [
  { value: "NONE", label: "None" },
  { value: "NAUSEA", label: "Nausea" },
  { value: "SKIN_IRRITATION", label: "Skin irritation" },
  { value: "DRY_MOUTH", label: "Dry mouth" },
  { value: "DROWSINESS", label: "Drowsiness" },
  { value: "OTHER", label: "Other" },
];



// Fetch the medical record for the current patient or by patient ID (for doctors)
export const getMedicalRecord = async (patientProfileId?: number): Promise<MedicalRecord | null> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Access token not found");

  const id = patientProfileId ?? getIdFromToken(token);
  // const role = getRoleFromToken(token);

  // console.log("User ID:", id);
  // console.log("User Role:", role);

  const url = `${API_BASE_URL}?patient_id=${id}`;
  try {
    const response = await axios.get<MedicalRecord[]>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error: any) {
    console.error("Error fetching medical record:", error.response?.data || error.message);
    throw error;
  }
};



// Create a new medical record
export const createMedicalRecord = async (recordData: MedicalRecord): Promise<MedicalRecord> => {
  try {
      const accessToken = getAccessToken();
      const response = await axios.post<MedicalRecord>(API_BASE_URL, recordData, {
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      });
      return response.data;
  } catch (error: any) {
      console.error("Error creating medical record:", error.response?.data || error.message);
      throw error;
  }
};

// Update an existing medical record (PATCH)
export const updateMedicalRecord = async (recordId: number, recordData: Partial<MedicalRecord>): Promise<MedicalRecord> => {
  try {
      const accessToken = getAccessToken();
      const response = await axios.patch<MedicalRecord>(`${API_BASE_URL}${recordId}/`, recordData, {
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      });
      return response.data;
  } catch (error: any) {
      console.error("Error updating medical record:", error.response?.data || error.message);
      throw error;
  }
};

// Delete a medical record
export const deleteMedicalRecord = async (recordId: number): Promise<void> => {
  try {
      const accessToken = getAccessToken();
      await axios.delete(`${API_BASE_URL}${recordId}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
      });
  } catch (error: any) {
      console.error("Error deleting medical record:", error.response?.data || error.message);
      throw error;
  }
};

