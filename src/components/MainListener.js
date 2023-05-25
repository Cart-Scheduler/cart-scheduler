import { useListenAuth } from '../services/auth';
import {
  useListenUser,
  useListenPerson,
  useDetachListeners,
} from '../services/db';

// Simple wrapper component that listens different stuff.
export default function MainListener({ children }) {
  useListenAuth();
  useListenUser();
  useListenPerson();
  useDetachListeners();
  return children;
}
