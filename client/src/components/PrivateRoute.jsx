import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route and enforces authentication + role-based access.
 * - If not logged in → redirect to /login
 * - If logged in but wrong role → redirect to their own dashboard
 * - If loading (restoring session) → show a spinner
 */
export default function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the user's correct dashboard instead of a generic error
    const dashboards = {
      customer: '/customer/dashboard',
      agent: '/agent/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={dashboards[user.role] || '/login'} replace />;
  }

  return children;
}
