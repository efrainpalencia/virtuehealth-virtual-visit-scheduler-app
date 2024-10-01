import axiosInstance from '../config/axiosConfig';

class AuthService {
    login(username: string, password: string) {
        return axiosInstance
            .post('login/', {
                username,
                password,
            })
            .then((response: { data: { access: string; refresh: string; user_type: string; }; }) => {
                if (response.data.access) {
                    localStorage.setItem('access_token', response.data.access);
                    localStorage.setItem('refresh_token', response.data.refresh);
                    localStorage.setItem('user_type', response.data.user_type);
                }
                return response.data;
            })
            .catch(error => {
                console.error("Login error:", error.response ? error.response.data : error.message);
                throw error;
            });
    }

    logout() {
        const refreshToken = localStorage.getItem('refresh_token');
        return axiosInstance
            .post('logout/', {
                refresh_token: refreshToken,
            })
            .then((response: { data: unknown; }) => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_type');
                return response.data;
            })
            .catch(error => {
                console.error("Logout error:", error.response ? error.response.data : error.message);
                throw error;
            });
    }

    getCurrentUser() {
        return localStorage.getItem('access_token');
    }

    getUserType() {
        return localStorage.getItem('user_type');
    }
}

export default new AuthService();
