import axios from 'axios';
import type { User, Booking } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5020/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

export const patientApi = {
  getAll: () => api.get('/patient'),
  getById: (id: string) => api.get(`/patient/${id}`),
  create: (data: any) => api.post('/patient', data),
  update: (id: string, data: any) => api.put(`/patient/${id}`, data),
  delete: (id: string) => api.delete(`/patient/${id}`),
};

export const bookingApi = {
  create: (data: any) => api.post('/appointment/CreateNewAppointment', data),
  getAll: () => api.get('/appointment/GetAllAppointment'),
  getDone: () => api.get('/appointment/GetDoneAppointment'),
  updateStatus: (id: string, status: string) => api.put(`/appointment/${id}/status`, { status }),
};

// Enquiry and other APIs can be added here if needed

export default api;
