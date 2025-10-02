import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { bookingApi } from '../../services/api';
import { Calendar, Clock, FileText, XCircle } from 'lucide-react';
import type { Booking } from '../../types';
import Swal from 'sweetalert2';

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingApi.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Cancel Booking',
      text: 'Are you sure you want to cancel this booking?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No',
      confirmButtonColor: '#EF4444',
    });

    if (result.isConfirmed) {
      try {
        await bookingApi.cancel(bookingId);
        Swal.fire({
          icon: 'success',
          title: 'Booking Cancelled',
          text: 'Your booking has been cancelled successfully',
          timer: 2000,
          showConfirmButton: false,
        });
        loadBookings();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Cancellation Failed',
          text: error.response?.data?.message || 'Failed to cancel booking',
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Cancelled':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Complete':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">View and manage your appointments</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 mb-6">You haven't made any appointments yet</p>
            <a
              href="/patient/dashboard"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book Appointment
            </a>
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
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          booking.paymentStatus === 'Paid'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        <span>
                          <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <Clock className="h-5 w-5 mr-2 text-blue-600" />
                        <span>
                          <strong>Time:</strong> {booking.timeSlot}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-4 flex items-start text-gray-700">
                        <FileText className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Notes:</strong>
                          <p className="text-gray-600 mt-1">{booking.notes}</p>
                        </div>
                      </div>
                    )}

                    {booking.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Rejection Reason:</strong> {booking.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>

                  {booking.status === 'Booked' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="ml-4 flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
