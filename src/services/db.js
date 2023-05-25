import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc as updateDocFirestore,
  where,
  Timestamp,
} from 'firebase/firestore';

import { getApp } from './firebase';
import {
  setDoc as setDbDoc,
  startLoading,
  removeDoc as removeDbDoc,
  setChangedDocs,
} from '../redux/slices/db';

let db;

export function initDb() {
  db = getFirestore(getApp());
}

// Converts given milliseconds to Firestore Timestamp object.
export const toTimestamp = (value) => new Timestamp(value / 1000, 0);

// Deep clones given object but converts Firestore.Timestamp to primitive number.
export function serializableClone(obj) {
  const clone = {};
  for (const prop in obj) {
    let val = obj[prop];
    if (val instanceof Timestamp) {
      val = val.toMillis();
    } else if (!Array.isArray(val) && val instanceof Object) {
      val = serializableClone(val);
    }
    clone[prop] = val;
  }
  return clone;
}

// Returns Firestore document data once.
export async function fetchDoc(path) {
  const ref = doc(db, path);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : undefined;
}

// Returns multiple Firestore documents in object, doc id as key.
export async function fetchDocs(path, queryFunc) {
  const docs = {};
  const ref = collection(db, path);
  // use provided query function or default query
  const myQuery = queryFunc ? queryFunc : (ref) => query(ref);
  const q = myQuery(ref);
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    docs[doc.id] = serializableClone(doc.data());
  });
  return docs;
}

// Object where all listeners are registered.
// Keys are unique listener keys / paths and values are unsubscription functions.
const listeners = {};

// Returns multiple Firestore documents in object, doc id as key.
function listenDoc(dispatch, path) {
  if (listeners[path]) {
    // already listening
    return;
  }
  const ref = doc(db, path);
  dispatch(startLoading(path));
  const unsubscribe = onSnapshot(
    ref,
    (doc) => {
      dispatch(
        setDbDoc({ path, data: serializableClone(doc.data()), key: path }),
      );
    },
    (error) => {
      console.error(error);
    },
  );
  listeners[path] = unsubscribe;
}

// Returns multiple Firestore documents in object, doc id as key.
function listenCollection(dispatch, path, queryFunc, key) {
  if (listeners[key ?? path]) {
    // already listening
    return;
  }
  const ref = collection(db, path);
  // use provided query function or default query
  const myQuery = queryFunc ? queryFunc : (ref) => query(ref);
  const q = myQuery(ref);
  dispatch(startLoading(key ?? path));
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const changed = {};
      const removed = [];
      snapshot.docChanges().forEach((change) => {
        const docPath = `${path}/${change.doc.id}`;
        if (change.type === 'removed') {
          removed.push(docPath);
        } else {
          changed[docPath] = serializableClone(change.doc.data());
        }
      });
      dispatch(setChangedDocs({ removed, changed, key }));
    },
    (error) => {
      console.error(error);
    },
  );
  listeners[key ?? path] = unsubscribe;
}

// Unsubscribes all listeners.
export function detachAllListeners() {
  for (const key of Object.keys(listeners)) {
    listeners[key]();
    delete listeners[key];
  }
}

export function useListenDoc(path) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (path) {
      let paths = path;
      if (typeof paths === 'string') {
        paths = [paths];
      }
      for (const entry of paths) {
        if (entry) {
          listenDoc(dispatch, entry);
        }
      }
    }
  }, [dispatch, path]);
}

export function useListenCollection(path, queryFunc, key) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (path) {
      listenCollection(dispatch, path, queryFunc, key);
    }
  }, [dispatch, path, queryFunc, key]);
}

// Hook that calls detachAllListeners when component is unmounted
export function useDetachListeners() {
  useEffect(() => detachAllListeners, []);
}

export async function updateDoc(path, data) {
  const ref = doc(db, path);
  await updateDocFirestore(ref, data);
}

// Returns count of documents in a query.
// This is more effective than reading all the documents.
export async function countDocs(path, queryFunc) {
  const ref = collection(db, path);
  // use provided query function or default query
  const myQuery = queryFunc ? queryFunc : (ref) => query(ref);
  const q = myQuery(ref);
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

export async function createJoinRequest(data) {
  const docRef = await addDoc(collection(db, 'joinRequests'), {
    ...data,
    created: serverTimestamp(),
  });
  return docRef.id;
}

// Adds given registration token to user document.
export async function addRegistrationToken(uid, token) {
  await updateDoc(`users/${uid}`, {
    regTokens: arrayUnion(token),
    modified: serverTimestamp(),
  });
}

// Hook that returns auth slice from state.
export function useAuth() {
  return useSelector((state) => state.auth);
}

// Hook that just returns current uid or undefined.
export function useUid() {
  return useSelector((state) => state.auth.user?.uid);
}

// Hook that returns current user document.
export function useListenUser() {
  const uid = useUid();
  const path = uid ? `users/${uid}` : undefined;
  useListenDoc(path);
  return useSelector((state) => state.db[path]);
}

// Hook that returns current person id.
export function usePersonId() {
  return useSelector((state) => {
    const uid = state.auth.user?.uid;
    return state.db[`users/${uid}`]?.personId;
  });
}

// Hook that returns current person document.
export function useListenPerson() {
  const personId = usePersonId();
  const path = personId ? `persons/${personId}` : undefined;
  useListenDoc(path);
  return useSelector((state) => state.db[path]);
}

// Hook that returns array of project ids that user is member of.
export function useMyProjectIds() {
  const personId = usePersonId();
  const myQuery = useCallback(
    (ref) => query(ref, where(`members.${personId}`, '!=', null)),
    [personId],
  );
  const path = personId ? 'projectMembers' : undefined;
  const key = 'myProjectMembers';
  useListenCollection(path, myQuery, key);

  return useSelector((state) => {
    const ids = Object.keys(state.db)
      .filter((path) => path.startsWith('projectMembers/'))
      .map((path) => path.slice(15));
    return {
      isLoading: state.db.__loading__[key],
      ids,
    };
  });
}

// Returns a project document that has already been fetched.
export function useDoc(path) {
  useListenDoc(path);
  return useSelector((state) => {
    return {
      isLoading: state.db.__loading__[path],
      data: state.db[path],
    };
  });
}

export function usePerson() {
  const personId = usePersonId();
  const path = personId ? `persons/${personId}` : undefined;
  return useDoc(path);
}

// Returns a project document that has already been fetched.
export function useProject(id) {
  return useDoc(`projects/${id}`);
}
