import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            if (!config.headers) {
                config.headers = {} as AxiosRequestHeaders;;
            }
            (config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await axiosInstance.post('token/refresh/', { refresh: refreshToken });
                    localStorage.setItem('access_token', response.data.access);
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error("Token refresh error:", refreshError.response ? refreshError.response.data : refreshError.message);
                    throw refreshError;
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
