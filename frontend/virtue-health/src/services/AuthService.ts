import axios from "axios";
import {jwtDecode} from "jwt-decode";

const API_URL = "http://localhost:8000/api/auth";
const EMAIL_API_URL = "http://localhost:8000/api";

interface RegisterResponse {
    user: unknown;
    refresh: string;
    token: string;
    exp: number;
}

interface DecodedToken {
    role: string;
    id: number;
    exp: number;
}

interface LoginResponse {
    access: string;
    refresh: string;
    user?: {
        id: number;
        email: string;
        role: string;
    };
    role?: string;
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
        return Date.now() >= decoded.exp * 1000;
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
        console.error("Failed to refresh token:", error);
        clearTokens();
        return null;
    }
};

// Create an Axios instance with interceptors
const API = axios.create({
    baseURL: API_URL,
});

// Create an Axios instance for email service
export const EmailAPI = axios.create({
    baseURL: EMAIL_API_URL,
});

// Email-specific interceptor (if needed)
EmailAPI.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

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
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && window.location.pathname !== "/login") {
            clearTokens();
            window.location.href = "/login"; // Redirect to login on 401
        }
        return Promise.reject(error);
    }
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
    try {
        const response = await API.post<LoginResponse>("/login/", { email, password });
        
        // Log response for debugging
        console.log("Login successful:", response.data);

        // Save tokens
        setTokens(response.data.access, response.data.refresh);

        return response.data;
    } catch (error: any) {
        // Log error for debugging
        console.error("Login error response:", error.response?.data);

        // Extract meaningful error messages
        if (error.response && error.response.data) {
            const backendError = error.response.data;
            if (backendError.non_field_errors) {
                throw new Error(backendError.non_field_errors[0]);
            }
            if (backendError.detail) {
                throw new Error(backendError.detail);
            }
        }

        // Fallback error
        throw new Error("An unexpected error occurred. Please try again later.");
    }
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
