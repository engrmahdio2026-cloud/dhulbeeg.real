// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Service
const api = {
    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        // Default headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add authorization token if exists
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);

            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'An error occurred'
                };
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);

            // Handle network errors
            if (error.message === 'Failed to fetch') {
                throw {
                    status: 0,
                    message: 'Network error. Please check your connection.'
                };
            }

            throw error;
        }
    },

    // Auth endpoints
    auth: {
        register: (userData) =>
            api.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            }),

        login: (credentials) =>
            api.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            }),

        logout: () =>
            api.request('/auth/logout', {
                method: 'POST'
            }),

        getCurrentUser: () =>
            api.request('/auth/me'),

        updateProfile: (profileData) =>
            api.request('/auth/me', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            }),

        changePassword: (passwordData) =>
            api.request('/auth/change-password', {
                method: 'PUT',
                body: JSON.stringify(passwordData)
            })
    },

    // Utility methods
    get: (endpoint) =>
        api.request(endpoint, { method: 'GET' }),

    post: (endpoint, data) =>
        api.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    put: (endpoint, data) =>
        api.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    delete: (endpoint) =>
        api.request(endpoint, { method: 'DELETE' })
};

// Check if user is authenticated
api.isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
};

// Get current user from localStorage
api.getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Clear auth data
api.clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Health check
api.healthCheck = async() => {
    try {
        const response = await api.get('/health');
        return response;
    } catch (error) {
        console.error('Health check failed:', error);
        return null;
    }
};

// Export API
window.api = api;