import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { appointmentApi } from '../services/api';
import Swal from 'sweetalert2';

interface CheckoutFormProps {
  bookingData: any;
  paymentIntentId: string;
  onSuccess: () => void;
}

export default function CheckoutForm({ bookingData, paymentIntentId, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);

    // First, confirm the payment with Stripe
    const { error: paymentError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // Stay on the page to handle the next step
    });

    if (paymentError) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: paymentError.message,
      });
      setIsLoading(false);
      return;
    }

    // If payment is successful, confirm the booking with our backend
    try {
      await appointmentApi.confirm({
        ...bookingData,
        paymentIntentId,
      });

      Swal.fire({
        icon: 'success',
        title: 'Booking Confirmed!',
        text: 'Your appointment and payment were successful.',
      });
      onSuccess();

    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Confirmation Failed',
        text: error.response?.data?.message || 'Your payment was successful, but we failed to confirm your booking. Please contact support.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full mt-6 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {isLoading ? 'Processing...' : 'Pay & Confirm Appointment'}
      </button>
    </form>
  );
}