import { Outlet, Navigate, useLocation } from 'react-router';
import { useAuth } from '../services/db';

export default function PrivateLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading || user === undefined) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    const params = new URLSearchParams();
    params.set('next', location.pathname + location.search + location.hash);
    const path = `/signin?${params.toString()}`;

    return <Navigate to={path} replace />;
  }

  return <Outlet />;
}
