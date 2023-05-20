import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAuth } from '../services/auth';
import { fetchPerson } from '../redux/slices/person';

// Custom hook that fetches person document from Firestore.
// Use this hook only once for optimization, in the upper component.
export function useFetchPerson() {
  const dispatch = useDispatch();
  const auth = useAuth();
  const uid = auth?.uid;
  useEffect(() => {
    if (uid) {
      const promise = dispatch(fetchPerson(uid));
      return () => {
        promise.abort();
      };
    }
  }, [dispatch, uid]);
}

// Custom hook that returns:
// - Firebase auth object
// - person Firestore document
export function usePerson() {
  const auth = useAuth();
  const person = useSelector((state) => state.person.person);
  return { auth, person };
}
