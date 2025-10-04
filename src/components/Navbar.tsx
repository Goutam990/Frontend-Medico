import { Link } from 'react-router-dom';
import { Calendar, Settings, Users, LayoutDashboard } from 'lucide-react';

export default function Navbar() {

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MediBook</span>
            </Link>

            <div className="hidden md:flex ml-10 space-x-4">
              <Link
                to="/admin/dashboard"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/admin/patients"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
              >
                <Users className="h-4 w-4 mr-2" />
                Patients
              </Link>
              <Link
                to="/admin/bookings"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Bookings
              </Link>
              <Link
                to="/admin/calendar"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Link>
              <Link
                to="/admin/settings"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Dr. Admin</p>
                <p className="text-xs text-gray-500">Doctor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
