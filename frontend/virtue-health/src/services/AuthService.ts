import axios from 'axios';
import {jwtDecode} from "jwt-decode";

const API_URL = 'http://localhost:8000/api/auth';

interface RegisterResponse {
    user: unknown;
    refresh: string;
    token: string;
}

interface DecodedToken {
    role: string;
    id: number;
}

interface LoginResponse {
    access: string;
    refresh: string;
}

// Utility functions for token management
export const setTokens = (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
};

export const getAccessToken = (): string | null => localStorage.getItem("access_token");
export const getRefreshToken = (): string | null => localStorage.getItem("refresh_token");

export const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

// Registration functions
export const registerPatient = async (email: string, password: string): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(`${API_URL}/register-patient/register/`, { email, password });
    return response.data;
};

export const registerDoctor = async (email: string, password: string): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(`${API_URL}/register-doctor/register/`, { email, password });
    return response.data;
};

// Login function
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${API_URL}/login/`, { email, password });
    setTokens(response.data.access, response.data.refresh);
    return response.data;
}

// Logout function
export const logoutUser = () => {
    clearTokens();
};

// Token decoding functions
export const getRoleFromToken = (token: string): string => {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role;
};

export const getIdFromToken = (token: string): number => {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.id;
};
