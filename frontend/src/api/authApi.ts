import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Auth API functions
export const authApi = {
    /**
     * Login with email and password
     * Returns JWT token and user data
     */
    async login(email: string, password: string): Promise<{
        access_token: string;
        token_type: string;
        user: {
            id: number;
            email: string;
            role: string;
            is_active: boolean;
        };
    }> {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email,
            password
        });
        return response.data;
    },

    /**
     * Register a new user
     */
    async register(email: string, password: string, role: 'student' | 'admin' = 'student') {
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
            email,
            password,
            role
        });
        return response.data;
    },

    /**
     * Get current user info using token
     */
    async me(token: string) {
        const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};
