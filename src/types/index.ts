export interface User {
  id: string;
  username: string;
  email: string;
  // Other patient details can be added here as needed
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