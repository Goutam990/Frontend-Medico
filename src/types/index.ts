export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Patient' | 'Doctor';
}

export interface Booking {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  appointmentDate: string;
  appointmentTime: string;
  phoneNumber: string;
  address: string;
  status: string;
}