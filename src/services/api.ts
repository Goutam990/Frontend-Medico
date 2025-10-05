import axios from 'axios';
import type { Booking } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5020';

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


export const bookingApi = {
  // POST /api/Appointment/CreateNewAppointment
  create: (data: {
    patientName: string;
    age: number;
    gender: string;
    appointmentDate: string;
    appointmentTime: string;
    phoneNumber: string;
    address: string;
  }) => {
    return api.post<Booking>('/api/Appointment/CreateNewAppointment', data);
  },

  // GET /api/Appointment/GetAllAppointment
  getAll: () => api.get<Booking[]>('/api/Appointment/GetAllAppointment'),

  // GET /api/Appointment/GetDoneAppointment
  getDone: () => api.get<Booking[]>('/api/Appointment/GetDoneAppointment'),

  // PUT /api/Appointment/{appointmentId}/status
  updateStatus: (id: string, status: string) =>
    api.put(`/api/Appointment/${id}/status`, { status }),

  // NOTE: The following endpoints might not be supported by the new backend.
  getById: (id: string) => api.get<Booking>(`/bookings/${id}`),

  getMyBookings: () => api.get<Booking[]>('/bookings/my-bookings'),

  cancel: (id: string) => api.patch<Booking>(`/bookings/${id}/cancel`),

  getCalendarBookings: (start?: string, end?: string) =>
    api.get<Booking[]>('/bookings/calendar', { params: { start, end } }),
};


export default api;
