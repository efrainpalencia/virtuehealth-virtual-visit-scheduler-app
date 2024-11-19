import axios from "axios";
import {jwtDecode} from "jwt-decode";

const API_URL = "http://localhost:8000/api/auth";

interface RegisterResponse {
    user: unknown;
    refresh: string;
    token: string;
    exp: number;
}

interface DecodedToken {
    role: string;
    id: number;
    exp: number; // Expiration timestamp
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

// Decode and check token expiration
export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true; // Treat invalid token as expired
    }
};

// Refresh the access token
export const refreshAccessToken = async (): Promise<string | null> => {
    const refresh = getRefreshToken();
    if (!refresh) {
        clearTokens();
        return null;
    }

    try {
        const response = await axios.post<{ access: string }>(`${API_URL}/token/refresh/`, { refresh });
        setTokens(response.data.access, refresh); // Update access token
        return response.data.access;
    } catch (error) {
        clearTokens();
        console.error("Failed to refresh token:", error);
        return null;
    }
};

// Create an Axios instance with interceptors
const API = axios.create({
    baseURL: API_URL,
});

API.interceptors.request.use(
    async (config) => {
        let access = getAccessToken();
        if (access && isTokenExpired(access)) {
            access = await refreshAccessToken();
        }

        if (access) {
            config.headers.Authorization = `Bearer ${access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Registration functions
export const registerPatient = async (email: string, password: string): Promise<RegisterResponse> => {
    const response = await API.post<RegisterResponse>("/register-patient/register/", { email, password });
    return response.data;
};

export const registerDoctor = async (email: string, password: string): Promise<RegisterResponse> => {
    const response = await API.post<RegisterResponse>("/register-doctor/register/", { email, password });
    return response.data;
};

// Login function
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await API.post<LoginResponse>("/login/", { email, password });
    setTokens(response.data.access, response.data.refresh);
    return response.data;
};

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

// Export the Axios instance
export default API;
