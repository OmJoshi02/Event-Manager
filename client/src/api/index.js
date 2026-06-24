import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data)      => api.post('/auth/register', data),
  login:    (data)      => api.post('/auth/login', data),
  getProfile: ()        => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getUsers: ()          => api.get('/auth/users'),
  deleteUser: (id)      => api.delete(`/auth/users/${id}`),
  makeAdmin: (id)       => api.patch(`/api/users/${id}/make-admin`),
};

// ─── Events ───────────────────────────────────────────────────────────────────
export const eventsAPI = {
  getAll: () => api.get('/api/events/show'),
  getOne: (id) => api.get(`/api/events/show/${id}`),
  create: (data) => api.post('/api/events/add', data),
  update: (id,data) => api.put(`/api/events/update/${id}`, data),
  delete: (id) => api.delete(`/api/events/delete/${id}`)
}

// ─── Registrations ────────────────────────────────────────────────────────────
export const registrationsAPI = {
  register:     (data)    => api.post('/registration', data),
  getMine:      ()        => api.get('/registration/me'),
  getForEvent:  (eventId) => api.get(`/registration/event/${eventId}`),
  cancel:       (id)      => api.delete(`/registration/${id}`),
};

// ─── Payments ─────────────────────────────────────────────────────────────────
export const paymentsAPI = {
  pay: (registrationId, data) => api.post(`/payment/pay/${registrationId}`, data),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardAPI = {
getStats: () => api.get('/api/dashboard/stats'),
getEventStats: () => api.get('/api/dashboard/event-stats'),
};
