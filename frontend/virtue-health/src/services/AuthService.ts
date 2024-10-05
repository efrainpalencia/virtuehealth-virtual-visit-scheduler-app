import axios from 'axios';
import jwtDecode from 'jwt-decode';

class AuthService {
    static async login(email: string, password: string) {
        const response = await axios.post('/api/token/', { email, password });
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
    }

    static logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    static getAccessToken() {
        return localStorage.getItem('access_token');
    }

    static getRefreshToken() {
        return localStorage.getItem('refresh_token');
    }

    static async refreshToken() {
        const refresh = this.getRefreshToken();
        const response = await axios.post('/api/token/refresh/', { refresh });
        localStorage.setItem('access_token', response.data.access);
        return response.data.access;
    }

    static async getUserType() {
        const token = this.getAccessToken();
        if (token) {
            const decoded: unknown = jwtDecode(token);  // Ensure jwtDecode is correctly typed
            return decoded.user_type;  // Or fetch from your API endpoint
        }
        throw new Error('No access token found');
    }
}

export default AuthService;
