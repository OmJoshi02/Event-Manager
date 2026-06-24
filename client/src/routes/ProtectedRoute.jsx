import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageSpinner } from '../components/common/UI';

export function ProtectedRoute() {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <PageSpinner />;
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AdminRoute() {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  if (loading) return <PageSpinner />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

export function GuestRoute() {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  if (loading) return <PageSpinner />;
  if (isLoggedIn) return <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />;
  return <Outlet />;
}
