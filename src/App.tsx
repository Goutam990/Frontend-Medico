import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/patient/MyBookings';
import Profile from './pages/patient/Profile';
import Patients from './pages/admin/Patients';
import Bookings from './pages/admin/Bookings';
import ProtectedRoute from './components/ProtectedRoute';

// Disabling imports for unsupported pages to prevent build errors
// import PatientDashboard from './pages/patient/Dashboard';
// import AdminDashboard from './pages/admin/Dashboard';
// import CalendarView from './pages/admin/CalendarView';
// import Settings from './pages/admin/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/patient/bookings" element={<ProtectedRoute requirePatient><MyBookings /></ProtectedRoute>} />
        <Route path="/patient/profile" element={<ProtectedRoute requirePatient><Profile /></ProtectedRoute>} />
        <Route path="/admin/patients" element={<ProtectedRoute requireDoctor><Patients /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute requireDoctor><Bookings /></ProtectedRoute>} />

        {/* Fallback and default routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;