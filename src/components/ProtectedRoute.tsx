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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireDoctor && !isDoctor) {
    return <Navigate to="/patient/bookings" replace />;
  }

  if (requirePatient && !isPatient) {
    return <Navigate to="/admin/bookings" replace />;
  }

  return <>{children}</>;
}
