import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('finz_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      'Terjadi kesalahan';

    // Auto-logout jika token expired / invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('finz_token');
      localStorage.removeItem('finz_user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }

    console.error('API Error:', message);
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;

// ═══════════ Auth API ═══════════
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
};

// ═══════════ User API ═══════════
export const userAPI = {
  getProfile: (id)       => api.get(`/users/${id}`),
  update:     (id, data) => api.put(`/users/${id}`, data),
};

// ═══════════ Transaction API ═══════════
export const transactionAPI = {
  getAll:  (params = {}) => api.get('/transactions', { params }),
  getById: (id)          => api.get(`/transactions/${id}`),
  create:  (data)        => api.post('/transactions', data),
  update:  (id, data)    => api.put(`/transactions/${id}`, data),
  delete:  (id)          => api.delete(`/transactions/${id}`),
};

// ═══════════ Budget API ═══════════
export const budgetAPI = {
  getAll:         (userId, month) => api.get(`/budgets/${userId}`, { params: { month } }),
  createOrUpdate: (data)          => api.post('/budgets', data),
  delete:         (id)            => api.delete(`/budgets/${id}`),
};

// ═══════════ Budget Alert API ═══════════
export const budgetAlertAPI = {
  getAlerts: (userId, month) => api.get(`/budget-alert/${userId}`, { params: { month } }),
};

// ═══════════ Dashboard API ═══════════
export const dashboardAPI = {
  getSummary: (userId = 1) => api.get(`/dashboard?user_id=${userId}`),
};

// ═══════════ AI / Prediction API ═══════════
export const predictionAPI = {
  getBalance:  (data)        => api.post('/predict/balance', data),
  getCategory: (description) => api.post('/predict/category', { description }),
};

export const recommendationAPI = {
  getAll:   (userId) => api.get(`/recommendation/${userId}`),
  getScore: (userId) => api.get(`/financial-score/${userId}`),
};
