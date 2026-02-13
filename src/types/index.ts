// Represents the user object returned by the backend upon login
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'Doctor' | 'Patient'; // Including all possible roles
  // Optional fields that might be available from a more detailed user endpoint
  username?: string;
  phoneNumber?: string;
}

// Represents the detailed Appointment model
export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'Booked' | 'Approved' | 'Rejected';
  // Optional detailed fields
  age?: number;
  gender?: string;
  address?: string;
  paymentIntentId?: string;
  paymentStatus?: 'Paid' | 'Unpaid' | 'Refunded' | 'Pending';
}

// Represents the availability of a doctor for a specific date
export interface DoctorAvailability {
  date: string;
  availableSlots: string[]; // e.g., ["09:00", "10:00", "11:00"]
}

// A simplified patient info model, as might be used in lists
export interface PatientInfo {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
}