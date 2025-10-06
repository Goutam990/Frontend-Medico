import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/patient/Dashboard';
import MyBookings from './pages/patient/MyBookings';
import Profile from './pages/patient/Profile';
import Patients from './pages/admin/Patients';
import Bookings from './pages/admin/Bookings';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/patient/dashboard',
    element: (
      <ProtectedRoute>
        <PatientDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/patient/bookings',
    element: (
      <ProtectedRoute>
        <MyBookings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/patient/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/patients',
    element: (
      <ProtectedRoute>
        <Patients />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/bookings',
    element: (
      <ProtectedRoute>
        <Bookings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);