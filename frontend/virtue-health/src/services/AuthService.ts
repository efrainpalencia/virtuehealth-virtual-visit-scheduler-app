import axios from 'axios';

const API_URL = '/api/auth/';

class AuthService {
    login(username: string, password: string) {
        return axios
            .post(API_URL + 'login/', {
                username,
                password,
            })
            .then(response => {
                if (response.data.access) {
                    localStorage.setItem('access_token', response.data.access);
                    localStorage.setItem('refresh_token', response.data.refresh);
                }
                return response.data;
            });
    }

    logout() {
        const refreshToken = localStorage.getItem('refresh_token');
        return axios
            .post(API_URL + 'logout/', {
                refresh_token: refreshToken,
            })
            .then(response => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return response.data;
            });
    }

    getCurrentUser() {
        return localStorage.getItem('access_token');
    }
}

export default new AuthService();
