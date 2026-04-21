import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const Fallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

export default function ProtectedRoute({ requireRole }) {
  const { isAuthenticated, isLoading, isProfileLoading, profile } = useAuth();
  const location = useLocation();

  // Wait for auth check
  if (isLoading) return <Fallback />;

  // Not logged in → login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-gated route: wait for profile before deciding
  if (requireRole) {
    if (isProfileLoading) return <Fallback />;
    if (profile?.role !== requireRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
}
