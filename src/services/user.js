import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAuth } from '../services/auth';
import { fetchPerson } from '../redux/slices/db';

// Custom hook that fetches person document from Firestore and returns data.
// Use this hook only in the main component because it triggers fetching.
export function usePerson() {
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
  return useSelector((state) => state.db.person);
}
