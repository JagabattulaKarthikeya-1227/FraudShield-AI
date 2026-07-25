import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

/**
 * Wraps authenticated route groups.
 * Redirects to /login with `?from=<original path>` so LoginPage can redirect
 * back after a successful login.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
