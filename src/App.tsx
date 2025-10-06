import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Patients from './pages/admin/Patients';
import Bookings from './pages/admin/Bookings';
import Profile from './pages/patient/Profile';
import ProtectedRoute from './components/ProtectedRoute';

// Disabling unsupported pages
// import PatientDashboard from './pages/patient/Dashboard';
// import MyBookings from './pages/patient/MyBookings';
// import AdminDashboard from './pages/admin/Dashboard';
// import CalendarView from './pages/admin/CalendarView';
// import Settings from './pages/admin/Settings';

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
    path: '/patient/profile',
    element: (
      <ProtectedRoute>
        <Profile />
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