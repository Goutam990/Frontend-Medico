import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/patient/Dashboard';
import MyBookings from './pages/patient/MyBookings';
import Profile from './pages/patient/Profile';
import Patients from './pages/admin/Patients';
import Bookings from './pages/admin/Bookings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/patient/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
        <Route path="/patient/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/patient/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/admin/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;