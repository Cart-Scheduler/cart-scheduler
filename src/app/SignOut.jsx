import { Navigate } from 'react-router';
import { useAuth } from '../services/db';
import { useSignOut } from '../services/auth';
import { useDeleteRegistrationToken } from '../services/messaging';

function AuthSignOut() {
  const signedOut = useSignOut();
  const { user } = useAuth();
  if (signedOut && !user) {
    return <Navigate to="/signin" />;
  }
  return null;
}

export default function SignOut() {
  const finished = useDeleteRegistrationToken();
  if (finished) {
    return <AuthSignOut />;
  }
  return null;
}
