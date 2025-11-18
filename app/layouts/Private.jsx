import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../services/db';
import NotificationController from '../components/notifications/Controller';
import CookieConsent from '../components/CookieConsent';
import Footer from './Footer';
import TimezoneChecker from '../components/TimezoneChecker';
import { useEffect } from 'react';

export default function PrivateLayout() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      console.log('PRIVATE LAYOUT: Tallensi polun:', window.location.pathname);
    }
  }, [user, loading]);

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

  return (
    <>
      <div className="min-height-300 bg-primary position-absolute w-100" />

      <main className="main-content position-relative border-radius-lg max-height-vh-100 h-100">
        <NotificationController />
        <Outlet />
        <TimezoneChecker />
        <Footer />
        <CookieConsent />
      </main>
    </>
  );
}
