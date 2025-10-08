import { useState } from 'react';
import { X, User, Hash, Droplet, Calendar, Clock, Phone, MapPin } from 'lucide-react';
import { paymentApi } from '../services/api';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key');

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
    startTime: '',
    phoneNumber: '',
    address: '',
    status: 'Pending',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [bookingDataForConfirmation, setBookingDataForConfirmation] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { appointmentDate, startTime } = formData;
      const startDateTime = new Date(`${appointmentDate}T${startTime}`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

      const formatTime = (date: Date) => `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

      const completeBookingData = {
        ...formData,
        age: Number(formData.age),
        endTime: formatTime(endDateTime),
      };

      const paymentResponse = await paymentApi.createIntent({
        bookingDetails: completeBookingData,
        amount: 10000, // Example: $100.00 in cents
      });

      setClientSecret(paymentResponse.data.clientSecret);
      setPaymentIntentId(paymentResponse.data.paymentIntentId);
      setBookingDataForConfirmation(completeBookingData);

    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Could not proceed to payment.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const twoMonthsFromNow = new Date();
  twoMonthsFromNow.setMonth(today.getMonth() + 2);
  const maxDate = twoMonthsFromNow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {clientSecret ? 'Complete Your Payment' : 'Book New Appointment'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {clientSecret && bookingDataForConfirmation ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                bookingData={bookingDataForConfirmation}
                paymentIntentId={paymentIntentId}
                onSuccess={() => {
                  onSuccess?.();
                  onClose();
                }}
              />
            </Elements>
          ) : (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-2"><User className="inline h-4 w-4 mr-2" />Patient Name *</label><input type="text" name="patientName" required value={formData.patientName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2"><Hash className="inline h-4 w-4 mr-2" />Age *</label><input type="number" name="age" required value={formData.age} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2"><Droplet className="inline h-4 w-4 mr-2" />Gender *</label><select name="gender" required value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2"><Phone className="inline h-4 w-4 mr-2" />Phone Number *</label><input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2"><Calendar className="inline h-4 w-4 mr-2" />Appointment Date *</label><input type="date" name="appointmentDate" required min={minDate} max={maxDate} value={formData.appointmentDate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2"><Clock className="inline h-4 w-4 mr-2" />Start Time *</label><input type="time" name="startTime" required value={formData.startTime} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="inline h-4 w-4 mr-2" />Address *</label><textarea name="address" required value={formData.address} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{isLoading ? 'Creating...' : 'Proceed to Payment'}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}