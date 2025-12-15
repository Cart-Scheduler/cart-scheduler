import { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router';
import { useAuth } from '../services/db';

export default function PrivateLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      const currentPath = location.pathname + location.search + location.hash;
      localStorage.setItem('redirectAfterLogin', currentPath);
    }
  }, [user, loading, location]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
}
