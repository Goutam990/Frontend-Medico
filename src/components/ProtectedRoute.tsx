import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireDoctor?: boolean;
  requirePatient?: boolean;
}

export default function ProtectedRoute({
  children,
  requireDoctor,
  requirePatient,
}: ProtectedRouteProps) {
  const { isAuthenticated, isDoctor, isPatient } = useAuth();

  // With the AuthProvider loading synchronously, we can now safely check
  // for authentication on the first render without an isLoading state.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, check for role-based access.
  if (requireDoctor && !isDoctor) {
    return <Navigate to="/patient/bookings" replace />;
  }

  if (requirePatient && !isPatient) {
    return <Navigate to="/admin/bookings" replace />;
  }

  // If all checks pass, render the requested component.
  return <>{children}</>;
}