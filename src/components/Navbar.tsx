import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isDoctor, isPatient } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isDoctor ? "/admin/bookings" : "/patient/bookings"} className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MediBook</span>
            </Link>

            <div className="hidden md:flex ml-10 space-x-4">
              {isDoctor && (
                <>
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
                    Appointments
                  </Link>
                </>
              )}
              {isPatient && (
                 <Link
                    to="/patient/bookings"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    My Appointments
                  </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link to="/patient/profile" className="flex items-center space-x-3">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <UserIcon className="h-8 w-8 text-gray-600" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}