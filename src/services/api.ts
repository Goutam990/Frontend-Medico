import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5020/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers for all protected API calls
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  // POST /api/auth/register
  register: (userData: any) => api.post('/auth/register', userData),

  // POST /api/auth/login
  login: (credentials: any) => api.post('/auth/login', credentials),

  // POST /api/auth/logout
  logout: () => api.post('/auth/logout'),
};

export const userApi = {
    // GET /api/users
    getAll: () => api.get('/users'),
};

export const appointmentApi = {
  // GET /api/admin/appointments (For Admin)
  getAllForAdmin: () => api.get('/admin/appointments'),

  // GET /api/patient/appointments/upcoming (For Patient)
  getPatientUpcoming: () => api.get('/patient/appointments/upcoming'),

  // POST /api/appointments
  create: (appointmentData: any) => api.post('/appointments', appointmentData),

  // PUT /api/appointments/{id}
  update: (id: string, appointmentData: any) => api.put(`/appointments/${id}`, appointmentData),

  // DELETE /api/appointments/{id}
  delete: (id: string) => api.delete(`/appointments/${id}`),
};

export default api;