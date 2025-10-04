import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/Register';

import PatientDashboard from './pages/patient/Dashboard';
import MyBookings from './pages/patient/MyBookings';
import Profile from './pages/patient/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import Patients from './pages/admin/Patients';
import Bookings from './pages/admin/Bookings';
import CalendarView from './pages/admin/CalendarView';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/register" element={<Register />} />

        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/bookings" element={<MyBookings />} />
        <Route path="/patient/profile" element={<Profile />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/patients" element={<Patients />} />
        <Route path="/admin/bookings" element={<Bookings />} />
        <Route path="/admin/calendar" element={<CalendarView />} />
        <Route path="/admin/settings" element={<Settings />} />

        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
