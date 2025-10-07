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
  const { isAuthenticated, isDoctor, isPatient, isLoading } = useAuth();

  // First, handle the loading state. While isLoading is true, we cannot make
  // a decision about authentication. This prevents the redirect loop.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Once loading is complete, we can safely check for authentication.
  // If the user is not authenticated, redirect them to the login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, check for role-specific access.
  if (requireDoctor && !isDoctor) {
    return <Navigate to="/patient/bookings" replace />;
  }

  if (requirePatient && !isPatient) {
    return <Navigate to="/admin/bookings" replace />;
  }

  // If all checks pass, render the requested component.
  return <>{children}</>;
}