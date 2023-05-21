import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAuth } from '../services/auth';
import { useListenDoc } from '../services/firebase';
import { setPerson } from '../redux/slices/person';
import { setUser } from '../redux/slices/user';

// Custom hook that listens to person document changes.
// Writes person document into redux store.
function useListenUser() {
  const dispatch = useDispatch();
  const { uid } = useAuth() ?? {};
  const userData = useListenDoc(`users/${uid}`, { skip: !uid });
  useEffect(() => {
    dispatch(setUser(userData));
  }, [dispatch, userData]);
}

// Custom hook that listens to person document changes.
// Writes person document into redux store.
function useListenPerson() {
  const dispatch = useDispatch();
  const personId = useSelector((state) => state.user.personId);
  const personData = useListenDoc(`persons/${personId}`, { skip: !personId });
  useEffect(() => {
    dispatch(setPerson(personData));
  }, [dispatch, personData]);
}

// Custom hook to be used in the upper component. Use only in one component.
export function usePersonInit() {
  useListenPerson();
  useListenUser();
}

// Custom hook that returns person data from redux state.
export function usePerson() {
  return useSelector((state) => ({
    personId: state.user.personId,
    person: state.person,
  }));
}

// Custom hook that returns person data from redux state.
export function useUser() {
  return useSelector((state) => state.user);
}
