import { Navigate } from 'react-router-dom';

import { useSignOut } from '../services/auth';
import { useDeleteRegistrationToken } from '../services/messaging';

function AuthSignOut() {
  const signedOut = useSignOut();
  if (signedOut) {
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
