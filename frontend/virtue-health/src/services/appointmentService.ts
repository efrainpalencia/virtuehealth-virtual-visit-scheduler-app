import axios from 'axios';

export interface Appointment {
  id?: number;
  patient_id?: number;
  doctor_id: number;
  date: string;
  reason: 'CHRONIC_CARE' | 'PREVENTATIVE_CARE' | 'SURGICAL_POST_OP' | 'OTHER';
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
}


const API_URL = 'http://localhost:8000/api/appointments';

// Get all appointments
export const getAppointments = async (): Promise<Appointment[]> => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

// Get an appointment by ID
export const getAppointmentById = async (appointmentId: number): Promise<Appointment> => {
  const response = await axios.get(`${API_URL}/${appointmentId}/`);
  return response.data;
};

// Create a new appointment
export const createAppointment = async (appointmentData: Appointment): Promise<Appointment> => {
  const response = await axios.post(`${API_URL}/`, appointmentData);
  return response.data;
};

// Update an appointment
export const updateAppointment = async (
  appointmentId: number,
  appointmentData: Partial<Appointment>
): Promise<Appointment> => {
  const response = await axios.put(`${API_URL}/${appointmentId}/`, appointmentData);
  return response.data;
};

// Delete an appointment
export const deleteAppointment = async (appointmentId: number): Promise<void> => {
  await axios.delete(`${API_URL}/${appointmentId}/`);
};

// Schedule an appointment
export const scheduleAppointment = async (appointment: Appointment) => {
    try {
      const response = await axios.post(`${API_URL}/book/`, appointment);
      return response.data;
    } catch (error) {
      console.error("Error scheduling appointment", error);
      throw error;
    }
  };
  
  // Cancel an appointment
  export const cancelAppointment = async (appointmentId: number) => {
    try {
      const response = await axios.post(`${API_URL}/cancel/${appointmentId}/`);
      return response.data;
    } catch (error) {
      console.error("Error canceling appointment", error);
      throw error;
    }
  };

