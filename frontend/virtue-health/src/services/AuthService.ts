import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const API_URL = 'http://localhost:8000/api/auth';

interface RegisterResponse {
    user: unknown;
    refresh: string;
    token: string;
}

interface DecodedToken {
    role: string;
}

export const registerPatient = async (email: string, password: string): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(`${API_URL}/register-patient/register/`, {
        email,
        password
    });
    return response.data;
};

export const registerDoctor = async (email: string, password: string): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(`${API_URL}/register-doctor/register/`, {
        email,
        password
    });
    return response.data;
};

interface LoginResponse {
    access: string;
    refresh: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${API_URL}/login/`, {
        email,
        password
    });
    return response.data;
}

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const getRoleFromToken = (token: string): string => {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role;

}