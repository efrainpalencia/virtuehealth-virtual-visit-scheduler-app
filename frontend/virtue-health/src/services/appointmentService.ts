import axios from 'axios';

export interface Appointment {
  id?: number;
  patient_id: number;
  doctor_id: number;
  date: string;
  reason: 'CHRONIC_CARE' | 'PREVENTATIVE_CARE' | 'SURGICAL_POST_OP' | 'OTHER';
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
}


const API_URL = 'http://localhost:8000/api/appointments';

// Get all appointments
export const getAppointments = async (patientId: number): Promise<Appointment[]> => {
  const response = await axios.get(`${API_URL}?patient_id=${patientId}`);
  return response.data;
};


// Get an appointment by ID
export const getAppointmentById = async (appointmentId: number): Promise<Appointment> => {
  const response = await axios.get(`${API_URL}/${appointmentId}/`);
  return response.data;
};

export const createAppointment = async (appointmentData: Appointment): Promise<Appointment> => {
  try {
    const response = await axios.post(`${API_URL}/`, appointmentData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating appointment:", error.response?.data || error.message);
    throw error; 
  }
};

// Update an appointment
export const updateAppointment = async (
  appointmentId: number,
  appointmentData: Partial<Appointment>
): Promise<Appointment> => {
  const response = await axios.patch(`${API_URL}/${appointmentId}/`, appointmentData);
  return response.data;
};

// Delete an appointment
export const deleteAppointment = async (appointmentId: number): Promise<void> => {
  await axios.delete(`${API_URL}/${appointmentId}/`);
};
