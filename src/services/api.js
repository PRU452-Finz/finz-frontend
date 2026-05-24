import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
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

// ═══════════ Transaction API ═══════════
export const transactionAPI = {
  getAll:  (params = {}) => api.get('/transactions', { params }),
  getById: (id)          => api.get(`/transactions/${id}`),
  create:  (data)        => api.post('/transactions', data),
  update:  (id, data)    => api.put(`/transactions/${id}`, data),
  delete:  (id)          => api.delete(`/transactions/${id}`),
};

// ═══════════ Dashboard API ═══════════
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard'),
};

// ═══════════ User API ═══════════
export const userAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  getBudgets: (id, month) => api.get(`/users/${id}/budgets${month ? `?month=${month}` : ''}`),
  upsertBudget: (id, data) => api.post(`/users/${id}/budgets`, data),
};

// ═══════════ Budget API ═══════════
export const budgetAPI = {
  getAll:         (userId, month) => api.get(`/users/${userId}/budgets`, { params: { month } }),
  createOrUpdate: (data)          => api.post(`/users/${data.user_id}/budgets`, data),
  delete:         (userId, budgetId) => api.delete(`/users/${userId}/budgets/${budgetId}`),
};

// ═══════════ Budget Alert API ═══════════
export const budgetAlertAPI = {
  getAlerts: (userId, month) => api.get(`/budget-alert/${userId}/${month}`),
};

// ═══════════ AI / Prediction API ═══════════
export const predictionAPI = {
  getBalance:  (data)        => api.post('/predict/balance', data),
  getCategory: (description) => api.post('/predict/category', { description }),
};

// ═══════════ Recommendation API ═══════════
export const recommendationAPI = {
  getAll:   (userId) => api.get(`/recommendation/${userId}`),
  getScore: (userId) => api.get(`/financial-score/${userId}`),
};

// ═══════════ Chat API ═══════════
export const chatAPI = {
  ask: (message, history = []) => api.post('/chat/ask', { message, history }),
};
