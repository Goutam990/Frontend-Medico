import { useState } from 'react';
import Navbar from '../../components/Navbar';
import BookingModal from '../../components/BookingModal';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function PatientDashboard() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Manage your appointments here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <Calendar className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="flex items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-md"
            >
              <Calendar className="h-8 w-8 mr-3" />
              <div className="text-left">
                <h3 className="text-xl font-bold">Book Appointment</h3>
                <p className="text-sm text-blue-100">Schedule a new appointment</p>
              </div>
            </button>

            <a
              href="/patient/bookings"
              className="flex items-center justify-center p-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-md"
            >
              <Clock className="h-8 w-8 mr-3" />
              <div className="text-left">
                <h3 className="text-xl font-bold">View My Bookings</h3>
                <p className="text-sm text-green-100">Check your appointment history</p>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>No upcoming appointments</p>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Book your first appointment
            </button>
          </div>
        </div>
      </div>

      {isBookingModalOpen && (
        <BookingModal onClose={() => setIsBookingModalOpen(false)} />
      )}
    </div>
  );
}
