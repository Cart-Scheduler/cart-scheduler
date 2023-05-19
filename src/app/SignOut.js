import { Navigate } from 'react-router-dom';
import { useSignOut } from '../services/auth';

export default function SignOut() {
  const signedOut = useSignOut();
  if (signedOut) {
    return <Navigate to="/signin" />;
  }
  return null;
}
