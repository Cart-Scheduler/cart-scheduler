import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../services/db';
import AuthLoading from '../components/AuthLoading';

// Returns path (string) from given location object.
const makePath = ({ pathname, search, hash }) => {
  return `${pathname}${search}${hash}`;
};

// RequireAuth forces the authorization before the children can be accessed
export default function RequireAuth({ children }) {
  const location = useLocation();
  const { initializing, user } = useAuth();
  if (initializing === undefined) {
    return <AuthLoading />;
  }

  if (user === null) {
    // Not authenticated.
    // Save current location into a query parameter so that we can redirect
    // user there after a successful authentication.
    const params = new URLSearchParams();
    params.set('next', makePath(location));
    const path = `/signin?${params.toString()}`;
    return <Navigate to={path} />;
  }

  return children;
}
