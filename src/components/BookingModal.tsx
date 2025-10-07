import { useState } from 'react';
import { X, User, Hash, Droplet, Calendar, Clock, Phone, MapPin } from 'lucide-react';
import { appointmentApi } from '../services/api';
import Swal from 'sweetalert2';

interface BookingModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BookingModal({ onClose, onSuccess }: BookingModalProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    appointmentDate: '',
    appointmentTime: '',
    phoneNumber: '',
    address: '',
    status: 'Booked', // Default status
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Calculate endTime: 1 hour after appointmentTime
      const { appointmentDate, appointmentTime } = formData;
      const startTime = new Date(`${appointmentDate}T${appointmentTime}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Add 1 hour in milliseconds

      const endHours = String(endTime.getHours()).padStart(2, '0');
      const endMinutes = String(endTime.getMinutes()).padStart(2, '0');
      const endTimeString = `${endHours}:${endMinutes}`;

      const appointmentData = {
        ...formData,
        age: Number(formData.age),
        endTime: endTimeString, // Add the calculated end time
      };

      await appointmentApi.create(appointmentData);

      Swal.fire({
        icon: 'success',
        title: 'Appointment Created',
        text: 'The new appointment has been created successfully.',
        timer: 2000,
        showConfirmButton: false,
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Creation Failed',
        text: error.response?.data?.message || 'Failed to create appointment',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Book New Appointment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"><User className="inline h-4 w-4 mr-2" />Patient Name *</label>
              <input type="text" name="patientName" required value={formData.patientName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"><Hash className="inline h-4 w-4 mr-2" />Age *</label>
              <input type="number" name="age" required value={formData.age} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"><Droplet className="inline h-4 w-4 mr-2" />Gender *</label>
              <select name="gender" required value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"><Phone className="inline h-4 w-4 mr-2" />Phone Number *</label>
              <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"><Calendar className="inline h-4 w-4 mr-2" />Appointment Date *</label>
              <input type="date" name="appointmentDate" required min={minDate} value={formData.appointmentDate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"><Clock className="inline h-4 w-4 mr-2" />Appointment Time *</label>
              <input type="time" name="appointmentTime" required value={formData.appointmentTime} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="inline h-4 w-4 mr-2" />Address *</label>
              <textarea name="address" required value={formData.address} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isLoading ? 'Creating...' : 'Create Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}