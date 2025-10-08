import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5020/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in the headers of protected requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
};

export const userApi = {
  getAll: () => api.get('/users'),
};

export const appointmentApi = {
  getAll: () => api.get('/appointments'),
  create: (appointmentData: any) => api.post('/appointments', appointmentData),
  update: (id: string, appointmentData: any) => api.put(`/appointments/${id}`, appointmentData),
  delete: (id: string) => api.delete(`/appointments/${id}`),
  confirm: (data: any) => api.post('/booking/confirm', data),
};

export const paymentApi = {
  createIntent: (data: any) => api.post('/payment/create-intent', data),
  refund: (paymentIntentId: string) => api.post(`/payment/${paymentIntentId}/refund`),
};

export default api;