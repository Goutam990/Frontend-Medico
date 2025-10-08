import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { bookingApi } from '../../services/api';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { Booking } from '../../types';
import Swal from 'sweetalert2';

export default function CalendarView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingApi.getCalendarBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return '#3B82F6';
      case 'Rejected':
        return '#EF4444';
      case 'Cancelled':
        return '#F59E0B';
      case 'Complete':
        return '#10B981';
      default:
        return '#F59E0B';
    }
  };

  const events = bookings.map((booking) => ({
    id: booking.id,
    title: `${booking.patientName} - ${booking.status}`,
    start: `${booking.date}T${booking.timeSlot}`,
    backgroundColor: getEventColor(booking.status),
    borderColor: getEventColor(booking.status),
    extendedProps: {
      booking,
    },
  }));

  const handleEventClick = (info: any) => {
    const booking = info.event.extendedProps.booking;
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleApprove = async (booking: Booking) => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Approve Booking',
      text: 'Are you sure you want to approve this booking?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve',
      confirmButtonColor: '#3B82F6',
    });

    if (result.isConfirmed) {
      try {
        await bookingApi.updateStatus(booking.id, 'Approved');
        Swal.fire({
          icon: 'success',
          title: 'Booking Approved',
          timer: 2000,
          showConfirmButton: false,
        });
        loadBookings();
        setShowDetailsModal(false);
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error.response?.data?.message || 'Failed to approve booking',
        });
      }
    }
  };

  const handleReject = async (booking: Booking) => {
    const { value: rejectionReason } = await Swal.fire({
      title: 'Reject Booking',
      input: 'textarea',
      inputLabel: 'Rejection Reason',
      inputPlaceholder: 'Enter the reason for rejection...',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#EF4444',
      inputValidator: (value) => {
        if (!value) {
          return 'Please provide a reason for rejection';
        }
      },
    });

    if (rejectionReason) {
      try {
        await bookingApi.updateStatus(booking.id, 'Rejected', { rejectionReason });
        Swal.fire({
          icon: 'success',
          title: 'Booking Rejected',
          timer: 2000,
          showConfirmButton: false,
        });
        loadBookings();
        setShowDetailsModal(false);
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error.response?.data?.message || 'Failed to reject booking',
        });
      }
    }
  };

  const handleComplete = async (booking: Booking) => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Mark as Complete',
      text: 'Are you sure you want to mark this booking as complete?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Complete',
      confirmButtonColor: '#10B981',
    });

    if (result.isConfirmed) {
      try {
        await bookingApi.updateStatus(booking.id, 'Complete');
        Swal.fire({
          icon: 'success',
          title: 'Booking Completed',
          timer: 2000,
          showConfirmButton: false,
        });
        loadBookings();
        setShowDetailsModal(false);
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error.response?.data?.message || 'Failed to update booking',
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-orange-100 text-orange-800';
      case 'Complete':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
          <p className="mt-2 text-gray-600">View all bookings in calendar format</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-blue-500 mr-2"></div>
              <span className="text-sm text-gray-700">Approved</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
              <span className="text-sm text-gray-700">Rejected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-orange-500 mr-2"></div>
              <span className="text-sm text-gray-700">Cancelled</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-700">Complete</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-yellow-500 mr-2"></div>
              <span className="text-sm text-gray-700">Booked (Pending)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            eventClick={handleEventClick}
            height="auto"
            editable={false}
            selectable={false}
          />
        </div>
      </div>

      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Patient Name</p>
                <p className="text-lg text-gray-900">{selectedBooking.patientName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-gray-900">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Time Slot</p>
                  <p className="text-gray-900">{selectedBooking.timeSlot}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Status</p>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    selectedBooking.paymentStatus === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedBooking.paymentStatus}
                  </span>
                </div>
              </div>

              {selectedBooking.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="text-gray-900 mt-1">{selectedBooking.notes}</p>
                </div>
              )}

              {selectedBooking.rejectionReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Rejection Reason</p>
                  <p className="text-red-800 mt-1">{selectedBooking.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end space-x-4">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
              {selectedBooking.status === 'Booked' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedBooking)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedBooking)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </>
              )}
              {selectedBooking.status === 'Approved' && (
                <button
                  onClick={() => handleComplete(selectedBooking)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
