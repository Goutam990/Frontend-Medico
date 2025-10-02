import axios from 'axios';
import type { User, Booking, WorkingHours, DashboardStats, Payment } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    dob: string;
    address?: string;
    gender?: string;
    profilePic?: File;
  }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    return api.post<{ token: string; user: User }>('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>('/auth/login', { email, password }),

  logout: () => api.post('/auth/logout'),

  getCurrentUser: () => api.get<User>('/auth/me'),
};

export const patientApi = {
  getAll: (page: number = 1, pageSize: number = 10, search?: string) =>
    api.get<{ data: User[]; total: number }>('/patients', {
      params: { page, pageSize, search },
    }),

  getById: (id: string) => api.get<User>(`/patients/${id}`),

  updateProfile: (id: string, data: Partial<User>) =>
    api.put<User>(`/patients/${id}`, data),

  toggleBlock: (id: string) => api.patch<User>(`/patients/${id}/block`),

  getPatientsWithBookings: () =>
    api.get<User[]>('/patients/with-bookings'),
};

export const bookingApi = {
  create: (data: {
    date: string;
    timeSlot: string;
    notes?: string;
    file?: File;
  }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    return api.post<Booking>('/bookings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getAll: (filters?: {
    status?: string;
    patientId?: string;
    date?: string;
    page?: number;
    pageSize?: number;
  }) =>
    api.get<{ data: Booking[]; total: number }>('/bookings', { params: filters }),

  getById: (id: string) => api.get<Booking>(`/bookings/${id}`),

  getMyBookings: () => api.get<Booking[]>('/bookings/my-bookings'),

  updateStatus: (
    id: string,
    status: string,
    data?: { rejectionReason?: string; timeSlot?: string; notes?: string }
  ) =>
    api.patch<Booking>(`/bookings/${id}/status`, { status, ...data }),

  cancel: (id: string) =>
    api.patch<Booking>(`/bookings/${id}/cancel`),

  getCalendarBookings: (start?: string, end?: string) =>
    api.get<Booking[]>('/bookings/calendar', { params: { start, end } }),
};

export const settingsApi = {
  getWorkingHours: () => api.get<WorkingHours[]>('/settings/working-hours'),

  updateWorkingHours: (hours: WorkingHours[]) =>
    api.put<WorkingHours[]>('/settings/working-hours', { hours }),

  getAvailableSlots: (date: string) =>
    api.get<string[]>('/settings/available-slots', { params: { date } }),
};

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/reports/stats'),
};

export const paymentApi = {
  createPaymentIntent: (bookingId: string, amount: number) =>
    api.post<{ clientSecret: string; paymentIntentId: string }>(
      '/payments/stripe-intent',
      { bookingId, amount }
    ),

  confirmPayment: (paymentIntentId: string, bookingId: string) =>
    api.post<Payment>('/payments/confirm', { paymentIntentId, bookingId }),
};

export default api;
