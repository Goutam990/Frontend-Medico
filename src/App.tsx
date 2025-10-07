import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import Patients from './pages/admin/Patients';
import Bookings from './pages/admin/Bookings';
import PatientDashboard from './pages/patient/Dashboard';
import MyBookings from './pages/patient/MyBookings';
import Profile from './pages/patient/Profile';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  // Public routes
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  // Admin / Doctor routes
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute requireDoctor>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/patients',
    element: (
      <ProtectedRoute requireDoctor>
        <Patients />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/bookings',
    element: (
      <ProtectedRoute requireDoctor>
        <Bookings />
      </ProtectedRoute>
    ),
  },

  // Patient routes
  {
    path: '/patient/dashboard',
    element: (
      <ProtectedRoute requirePatient>
        <PatientDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/patient/bookings',
    element: (
      <ProtectedRoute requirePatient>
        <MyBookings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/patient/profile',
    element: (
      <ProtectedRoute requirePatient>
        <Profile />
      </ProtectedRoute>
    ),
  },

  // Fallback and default routes
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
]);