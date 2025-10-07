import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import BookingModal from '../../components/BookingModal';
import { appointmentApi } from '../../services/api';
import { Eye, PlusCircle, Trash2 } from 'lucide-react';
import type { Booking } from '../../types';
import Swal from 'sweetalert2';
import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (dataTableRef.current) {
      dataTableRef.current.destroy();
    }
    if (bookings.length > 0 && tableRef.current) {
      dataTableRef.current = new DataTable(tableRef.current, {
        pageLength: 10,
        ordering: true,
        searching: true,
        responsive: true,
        destroy: true,
      });
    }
  }, [bookings]);

  const loadBookings = async () => {
    try {
      const response = await appointmentApi.getAllForAdmin();
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      Swal.fire({
        icon: 'error',
        title: 'Loading Failed',
        text: 'Could not load bookings from the server.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (booking: Booking, status: string) => {
    const actionText = status.toLowerCase();
    const result = await Swal.fire({
      title: `Confirm Status Change`,
      text: `Are you sure you want to mark this appointment as ${actionText}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, mark as ${actionText}`,
      confirmButtonColor: '#3B82F6',
    });

    if (result.isConfirmed) {
      try {
        await appointmentApi.update(booking.id, { ...booking, status });
        Swal.fire('Updated!', `The appointment has been marked as ${actionText}.`, 'success');
        loadBookings();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: error.response?.data?.message || 'Failed to update booking status.',
        });
      }
    }
  };

  const handleDelete = async (booking: Booking) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the appointment for ${booking.patientName}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await appointmentApi.delete(booking.id);
        Swal.fire('Deleted!', 'The appointment has been deleted.', 'success');
        loadBookings();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: error.response?.data?.message || 'Failed to delete the appointment.',
        });
      }
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
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
            <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
            <p className="mt-2 text-gray-600">Create, view, update, and delete appointments</p>
          </div>
          <button
            onClick={() => setShowBookingModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            New Appointment
          </button>
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
                      <td>{booking.status}</td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(booking)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Appointment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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

      {showBookingModal && (
        <BookingModal
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            loadBookings();
          }}
        />
      )}

      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm font-medium text-gray-500">Patient Name</p><p className="text-lg text-gray-900">{selectedBooking.patientName}</p></div>
                <div><p className="text-sm font-medium text-gray-500">Phone Number</p><p className="text-lg text-gray-900">{selectedBooking.phoneNumber}</p></div>
                <div><p className="text-sm font-medium text-gray-500">Age</p><p className="text-gray-900">{selectedBooking.age}</p></div>
                <div><p className="text-sm font-medium text-gray-500">Gender</p><p className="text-gray-900">{selectedBooking.gender}</p></div>
                <div><p className="text-sm font-medium text-gray-500">Appointment Date</p><p className="text-gray-900">{new Date(selectedBooking.appointmentDate).toLocaleDateString()}</p></div>
                <div><p className="text-sm font-medium text-gray-500">Appointment Time</p><p className="text-gray-900">{selectedBooking.appointmentTime}</p></div>
                <div><p className="text-sm font-medium text-gray-500">Status</p><p className="text-lg text-gray-900">{selectedBooking.status}</p></div>
              </div>
              <div><p className="text-sm font-medium text-gray-500">Address</p><p className="text-gray-900">{selectedBooking.address}</p></div>
            </div>
            <div className="p-6 border-t flex justify-end">
              <button onClick={() => setShowDetailsModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}