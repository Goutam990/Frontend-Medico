import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin/bookings" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MediBook</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-4">
              <Link
                to="/admin/bookings"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}