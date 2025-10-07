import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import BookingModal from '../../components/BookingModal';
import { appointmentApi } from '../../services/api';
import { Calendar, Clock, PlusCircle } from 'lucide-react';
import type { Booking } from '../../types';
import Swal from 'sweetalert2';

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    loadMyBookings();
  }, []);

  const loadMyBookings = async () => {
    try {
      const response = await appointmentApi.getPatientUpcoming();
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading your bookings:', error);
      Swal.fire({
        icon: 'error',
        title: 'Loading Failed',
        text: 'Could not load your upcoming appointments.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Booked':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Upcoming Appointments</h1>
            <p className="mt-2 text-gray-600">View and manage your upcoming appointments.</p>
          </div>
           <button
            onClick={() => setShowBookingModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Book New Appointment
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Appointments</h3>
            <p className="text-gray-600 mb-6">You have no appointments scheduled for the future.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        <span><strong>Date:</strong> {new Date(booking.appointmentDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-5 w-5 mr-2 text-blue-600" />
                        <span><strong>Time:</strong> {booking.appointmentTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showBookingModal && (
        <BookingModal
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            loadMyBookings();
          }}
        />
      )}
    </div>
  );
}