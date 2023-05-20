import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAuth } from '../services/auth';
import { useListenDoc } from '../services/firebase';
import { fetchUser, setPerson } from '../redux/slices/person';

// Custom hook that fetches user document from Firestore.
// Use this hook only once for optimization, in the upper component.
export function useFetchUser() {
  const dispatch = useDispatch();
  const auth = useAuth();
  const uid = auth?.uid;
  useEffect(() => {
    if (uid) {
      const promise = dispatch(fetchUser(uid));
      return () => {
        promise.abort();
      };
    }
  }, [dispatch, uid]);
}

// Custom hook that listens to person document changes.
// Writes person document into redux store.
export function useListenPerson() {
  const dispatch = useDispatch();
  const personId = useSelector((state) => state.person.id);
  const personData = useListenDoc(`persons/${personId}`, { skip: !personId });
  useEffect(() => {
    dispatch(setPerson(personData));
  }, [dispatch, personData]);
}

// Custom hook to be used in the upper component. Use only in one component.
export function usePersonInit() {
  useFetchUser();
  useListenPerson();
}

// Custom hook that returns person data from redux state.
export function usePerson() {
  const { id, data } = useSelector((state) => state.person);
  return { personId: id, person: data };
}
