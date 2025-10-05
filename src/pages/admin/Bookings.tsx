import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { bookingApi } from '../../services/api';
import { CheckCircle, XCircle, CreditCard as Edit } from 'lucide-react';
import type { Booking } from '../../types';
import Swal from 'sweetalert2';
import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (bookings.length > 0 && tableRef.current && !dataTableRef.current) {
      dataTableRef.current = new DataTable(tableRef.current, {
        pageLength: 10,
        ordering: true,
        searching: true,
        responsive: true,
      });
    }

    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    };
  }, [bookings]);

  const loadBookings = async () => {
    try {
      const response = await bookingApi.getAll();
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (booking: Booking) => {
    const result = await Swal.fire({
      title: 'Approve Booking',
      text: `Are you sure you want to approve this appointment for ${booking.patientName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      confirmButtonColor: '#3B82F6',
    });

    if (result.isConfirmed) {
      try {
        await bookingApi.updateStatus(booking.id, 'Approved');
        Swal.fire({
          icon: 'success',
          title: 'Booking Approved',
          text: 'The booking has been approved successfully',
          timer: 2000,
          showConfirmButton: false,
        });
        loadBookings();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Approval Failed',
          text: error.response?.data?.message || 'Failed to approve booking',
        });
      }
    }
  };

  const handleReject = async (booking: Booking) => {
    const result = await Swal.fire({
      title: 'Reject Booking',
      text: `Are you sure you want to reject this appointment for ${booking.patientName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#EF4444',
    });

    if (result.isConfirmed) {
      try {
        await bookingApi.updateStatus(booking.id, 'Rejected');
        Swal.fire({
          icon: 'success',
          title: 'Booking Rejected',
          text: 'The booking has been rejected successfully',
          timer: 2000,
          showConfirmButton: false,
        });
        loadBookings();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Rejection Failed',
          text: error.response?.data?.message || 'Failed to reject booking',
        });
      }
    }
  };

  const handleComplete = async (booking: Booking) => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Mark as Done',
      text: 'Are you sure you want to mark this booking as done?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Mark as Done',
      confirmButtonColor: '#10B981',
    });

    if (result.isConfirmed) {
      try {
        await bookingApi.updateStatus(booking.id, 'Done');
        Swal.fire({
          icon: 'success',
          title: 'Booking Completed',
          text: 'The booking has been marked as done',
          timer: 2000,
          showConfirmButton: false,
        });
        loadBookings();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: error.response?.data?.message || 'Failed to update booking',
        });
      }
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-orange-100 text-orange-800';
      case 'Done':
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
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="mt-2 text-gray-600">Manage and approve patient appointments</p>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table ref={tableRef} className="display w-full">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Appointment Date</th>
                    <th>Appointment Time</th>
                    <th>Phone Number</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.patientName}</td>
                      <td>{new Date(booking.appointmentDate).toLocaleDateString()}</td>
                      <td>{booking.appointmentTime}</td>
                      <td>{booking.phoneNumber}</td>
                      <td>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Details"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {booking.status === 'Booked' && (
                            <>
                              <button
                                onClick={() => handleApprove(booking)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleReject(booking)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {booking.status === 'Approved' && (
                            <button
                              onClick={() => handleComplete(booking)}
                              className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                              Mark as Done
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-gray-900">{selectedBooking.age}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-gray-900">{selectedBooking.gender}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Appointment Date</p>
                  <p className="text-gray-900">
                    {new Date(selectedBooking.appointmentDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Appointment Time</p>
                  <p className="text-gray-900">{selectedBooking.appointmentTime}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="text-gray-900">{selectedBooking.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-gray-900">{selectedBooking.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    selectedBooking.status
                  )}`}
                >
                  {selectedBooking.status}
                </span>
              </div>
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
                    onClick={() => {
                      handleApprove(selectedBooking);
                      setShowDetailsModal(false);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedBooking);
                      setShowDetailsModal(false);
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </>
              )}
              {selectedBooking.status === 'Approved' && (
                <button
                  onClick={() => {
                    handleComplete(selectedBooking);
                    setShowDetailsModal(false);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Mark as Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}