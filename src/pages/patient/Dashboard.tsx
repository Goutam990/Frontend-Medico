import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, User } from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.firstName || 'Patient'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here you can manage your appointments and personal information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/patient/bookings"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center"
          >
            <div className="bg-blue-100 p-4 rounded-full mr-4">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Appointments</h2>
              <p className="text-gray-600">View and manage your upcoming appointments.</p>
            </div>
          </Link>

          <Link
            to="/patient/profile"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center"
          >
            <div className="bg-green-100 p-4 rounded-full mr-4">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
              <p className="text-gray-600">Update your personal information.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}