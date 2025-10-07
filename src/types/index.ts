export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  isBlocked: boolean;
  createdAt: string;
  role: 'Patient' | 'Doctor';
}

export interface Booking {
  id: string;
  patientName: string;
  date: string;
  timeSlot: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  // Including other fields that might be useful for a details view
  age?: number;
  gender?: string;
  phoneNumber?: string;
  address?: string;
}