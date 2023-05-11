import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/firebase';

// RequireAuth forces the authorization before the children can be accessed
const RequireAuth = ({ children }) => {
  const location = useLocation();
  const user = useAuth();
  if (!user) {
    // User is not authenticated. Save current location where user
    // was trying to go, so we can redirect user there after
    // a successful login.
    return <Navigate to="/account/login" state={{ from: location }} />;
  }
  return children;
};

export default RequireAuth;
