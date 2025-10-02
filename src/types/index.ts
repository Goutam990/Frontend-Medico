export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address?: string;
  gender?: string;
  profilePic?: string;
  role: 'Doctor' | 'Patient';
  isBlocked: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  status: 'Booked' | 'Approved' | 'Rejected' | 'Complete' | 'Cancelled';
  notes?: string;
  rejectionReason?: string;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  fileUrl?: string;
  createdAt: string;
}

export interface WorkingHours {
  day: string;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

export interface DashboardStats {
  totalPatients: number;
  todaysBookings: number;
  pendingApprovals: number;
  completedToday: number;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  stripePaymentIntentId?: string;
  status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  createdAt: string;
}
