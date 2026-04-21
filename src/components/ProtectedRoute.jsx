import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const Fallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

export default function ProtectedRoute({ requireRole }) {
  const { isAuthenticated, isLoading, isProfileLoading, profileAttempted, profile } = useAuth();
  const location = useLocation();

  // Wait for auth check to complete
  if (isLoading) return <Fallback />;

  // Not logged in → send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-gated route: wait until profile fetch has finished at least once
  if (requireRole) {
    if (!profileAttempted || isProfileLoading) return <Fallback />;
    if (profile?.role !== requireRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
}
