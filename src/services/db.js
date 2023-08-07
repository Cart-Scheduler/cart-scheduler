import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
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
import { filterObj } from './object';
import {
  setDoc as setDbDoc,
  startLoading,
  removeDoc as removeDbDoc,
  setChangedDocs,
  setDbError,
} from '../redux/slices/db';

let db;

export function initDb() {
  db = getFirestore(getApp());
}

// Converts given milliseconds to Firestore Timestamp object.
export const toTimestamp = (value) => new Timestamp(value / 1000, 0);

export const dateToTimestamp = (date) =>
  new Timestamp(date.getTime() / 1000, 0);

// Rounds given value by flooring milliseconds.
export const roundTimestamp = (value) => Math.floor(value / 1000) * 1000;

// Wrapper function for Object.hasOwn.
const hasProp = (obj, prop) => {
  if (Object.hasOwn) {
    // not all browsers have Object.hasOwn
    return Object.hasOwn(obj, prop);
  }
  return obj.hasOwnProperty(prop);
};

// Deep clones given object but converts Firestore.Timestamp to primitive number.
export function serializableClone(obj) {
  const clone = {};
  for (const prop in obj) {
    if (hasProp(obj, prop)) {
      let val = obj[prop];
      if (val instanceof Timestamp) {
        val = val.toMillis();
      } else if (!Array.isArray(val) && val instanceof Object) {
        val = serializableClone(val);
      }
      clone[prop] = val;
    }
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
  dispatch(startLoading(path));
  const ref = doc(db, path);
  const unsubscribe = onSnapshot(
    ref,
    (doc) => {
      dispatch(
        setDbDoc({ path, data: serializableClone(doc.data()), key: path }),
      );
    },
    (error) => {
      const { code, message } = error;
      dispatch(setDbError({ key: path, code, message }));
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
      const { code, message } = error;
      dispatch(setDbError({ key, code, message }));
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

export async function createSlotRequest(data) {
  const docRef = await addDoc(collection(db, 'slotRequests'), {
    ...data,
    created: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateSlotRequest(id, data) {
  await updateDoc(`slotRequests/${id}`, {
    ...data,
    modified: serverTimestamp(),
  });
}

export async function deleteSlotRequest(id) {
  const ref = doc(db, `slotRequests/${id}`);
  await deleteDoc(ref);
}

// Returns [id, doc] where document matches given uid and token.
export async function getExistingFcmToken(uid, token) {
  const myQuery = (ref) =>
    query(ref, where('uid', '==', uid), where('token', '==', token));
  const docs = await fetchDocs('fcmTokens', myQuery);
  const entries = Object.entries(docs);
  return entries.length > 0 ? entries[0] : [undefined, undefined];
}

// Adds given registration token to user document.
export async function addRegistrationToken(uid, token) {
  const docRef = await addDoc(collection(db, 'fcmTokens'), {
    uid,
    token,
    updated: serverTimestamp(),
  });
  return docRef.id;
}

// Updates timestamp in the fcmToken document.
export async function touchRegistrationToken(id, uid) {
  await updateDoc(`fcmTokens/${id}`, {
    uid,
    updated: serverTimestamp(),
  });
}

export async function deleteRegistrationToken(id) {
  const ref = doc(db, `fcmTokens/${id}`);
  await deleteDoc(ref);
}

// Hook that returns auth slice from state.
export function useAuth() {
  return useSelector((state) => state.auth);
}

// Hook that just returns current uid or undefined.
export function useUid() {
  return useSelector((state) => state.auth.user?.uid);
}

// Hook that starts listening current user document.
export function useListenUser() {
  const uid = useUid();
  const path = uid ? `users/${uid}` : undefined;
  useListenDoc(path);
}

// Hook that returns error related to fetching current user document.
export function useUserDocError() {
  const uid = useUid();
  const path = uid ? `users/${uid}` : undefined;
  const error = useSelector((state) => state.db.__errors__[path]);
  return { error, uid };
}

// Hook that returns current person id.
export function usePersonId() {
  return useSelector((state) => {
    const uid = state.auth.user?.uid;
    return state.db[`users/${uid}`]?.personId;
  });
}

// Hook that starts listening current person document.
export function useListenPerson() {
  const personId = usePersonId();
  const path = personId ? `persons/${personId}` : undefined;
  useListenDoc(path);
}

// Hook that returns error related to fetching current person document.
export function usePersonDocError() {
  const personId = usePersonId();
  const path = personId ? `persons/${personId}` : undefined;
  const error = useSelector((state) => state.db.__errors__[path]);
  return { error, personId };
}

export async function updatePersonDoc(personId, data) {
  await updateDoc(`persons/${personId}`, {
    ...data,
    modified: serverTimestamp(),
  });
}

// not all browsers support Object.fromEntries
const shortenKeysLegacy = (obj, len) => {
  const result = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i].substring(len);
    result[key] = obj[keys[i]];
  }
  return result;
};

// Modifies given object so that "len" characters are extracted from the start
// of each key.
const shortenKeys = (obj, len) => {
  if (Object.fromEntries) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key.substring(len), value]),
    );
  }
  return shortenKeysLegacy(obj, len);
};

function useHasLoaded(isLoading) {
  const [loaded, setLoaded] = useState();
  useEffect(() => {
    if (loaded === undefined && isLoading) {
      setLoaded(false);
    } else if (loaded === false && !isLoading) {
      setLoaded(true);
    }
  }, [loaded, isLoading]);
  return loaded;
}

// Hook that extracts data from db state.
//
// Filter function gets argument [id, doc] and it should return truthy value
// to keep the entry. Path argument is for trimming keys in returned object.
// Using useCallback hook for filter function is greatly recommended.
function useExtractDb(key, filterFn, path) {
  const { db, error, isLoading } = useSelector((state) => ({
    db: state.db,
    error: state.db.__errors__[key],
    isLoading: state.db.__loading__[key],
  }));
  const hasLoaded = useHasLoaded(isLoading);
  return {
    docs: useMemo(() => {
      if (!path) {
        return {};
      }
      return shortenKeys(filterObj(db, filterFn), path.length + 1);
    }, [db, filterFn, path]),
    error,
    isLoading,
    hasLoaded,
  };
}

// Hook that returns members from all projects that user is member of.
export function useMyProjectMembers() {
  const personId = usePersonId();
  const path = personId ? 'projectMembers' : undefined;
  const key = 'myProjectMembers';
  const queryFn = useCallback(
    (ref) => query(ref, where(`members.${personId}`, '!=', null)),
    [personId],
  );
  useListenCollection(path, queryFn, key);

  // Returns true if db entry is a slot document for given projectId
  const filterMembers = useCallback(
    ([id, doc]) => id.startsWith(`${path}/`),
    [path],
  );
  return useExtractDb(key, filterMembers, path);
}

export function useProjectMembers(projectId) {
  const { docs } = useMyProjectMembers();
  return docs?.[projectId];
}

// Hook that returns all join requests for given projectId.
export function useJoinRequests(projectId) {
  const key = `joinRequests-${projectId}`;
  const path = projectId ? 'joinRequests' : undefined;
  const queryFn = (ref) => query(ref, where('projectId', '==', projectId));
  useListenCollection(path, queryFn, key);
  const filterDocs = useCallback(
    ([id, doc]) => id.startsWith(`${path}/`) && doc.projectId === projectId,
    [path, projectId],
  );
  return useExtractDb(key, filterDocs, path);
}

export async function deleteJoinRequest(id) {
  const ref = doc(db, `joinRequests/${id}`);
  await deleteDoc(ref);
}

export async function addPersonToProject(projectId, personId, name) {
  await updateDoc(`projectMembers/${projectId}`, {
    [`members.${personId}`]: { name },
    modified: serverTimestamp(),
  });
}

export async function removePersonsFromProject(projectId, personIds) {
  const data = {
    modified: serverTimestamp(),
  };
  for (let i = 0; i < personIds.length; i++) {
    data[`members.${personIds[i]}`] = deleteField();
  }
  await updateDoc(`projectMembers/${projectId}`, data);
}

export async function updateProjectMembers(projectId, members) {
  const data = {
    modified: serverTimestamp(),
    ...members,
  };
  await updateDoc(`projectMembers/${projectId}`, data);
}

export async function updateProject(projectId, data) {
  await updateDoc(`projects/${projectId}`, {
    ...data,
    modified: serverTimestamp(),
  });
}

export async function deleteProjectLocations(projectId, locationIds) {
  const data = {
    modified: serverTimestamp(),
  };
  for (let i = 0; i < locationIds.length; i++) {
    data[`locations.${locationIds[i]}`] = deleteField();
  }
  await updateDoc(`projects/${projectId}`, data);
}

export async function createSlot(data) {
  const docRef = await addDoc(collection(db, 'slots'), {
    ...data,
    starts: dateToTimestamp(data.starts),
    ends: dateToTimestamp(data.ends),
    created: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteSlot(id) {
  const ref = doc(db, `slots/${id}`);
  await deleteDoc(ref);
}

// Updates persons field in slot. Replaces the field content.
export async function updateSlotPersons(slotId, persons) {
  await updateDoc(`slots/${slotId}`, {
    persons,
    modified: serverTimestamp(),
  });
}

// Hook that returns filtered slot documents.
export function useSlots(projectId, starts, ends) {
  const path = 'slots';
  const key = `slots-${projectId}-${starts}-${ends}`;
  const queryFn = useCallback(
    (ref) => {
      const params = [ref, where('projectId', '==', projectId)];
      if (starts) {
        params.push(where('starts', '>=', dateToTimestamp(starts)));
      }
      if (ends) {
        params.push(where('starts', '<', dateToTimestamp(ends)));
      }
      return query(...params);
    },
    [projectId, starts, ends],
  );
  useListenCollection(path, queryFn, key);

  // Returns true if db entry is a slot document that matches the filters.
  const filterSlots = useCallback(
    ([id, doc]) => {
      if (!id.startsWith(`${path}/`) || doc.projectId !== projectId) {
        return false;
      }
      if (starts && doc.starts < starts.getTime()) {
        return false;
      }
      if (ends && doc.starts >= ends.getTime()) {
        return false;
      }
      return true;
    },
    [projectId, starts, ends],
  );
  return useExtractDb(key, filterSlots, path);
}

// Hook that returns all slots where given personId is assigned.
export function useMySlots(personId) {
  const key = 'mySlots';
  const path = personId ? 'slots' : undefined;
  const queryFn = (ref) => query(ref, where(`persons.${personId}`, '!=', null));
  useListenCollection(path, queryFn, key);
  const filterSlots = useCallback(
    ([id, doc]) => id.startsWith(`${path}/`) && doc.persons?.[personId],
    [path, personId],
  );
  return useExtractDb(key, filterSlots, path);
}

// Hook that returns all slotRequests for given personId.
export function useSlotRequests(personId) {
  const key = 'mySlotRequests';
  const path = personId ? 'slotRequests' : undefined;
  const queryFn = (ref) => query(ref, where(`persons.${personId}`, '!=', null));
  useListenCollection(path, queryFn, key);
  const filterSlots = useCallback(
    ([id, doc]) => id.startsWith(`${path}/`),
    [path],
  );
  return useExtractDb(key, filterSlots, path);
}

// Hook that returns all slotRequests for given projectId.
export function useSlotRequestsByProject(projectId) {
  const key = `slotRequests-${projectId}`;
  const path = projectId ? 'slotRequests' : undefined;
  const queryFn = (ref) => query(ref, where('projectId', '==', projectId));
  useListenCollection(path, queryFn, key);
  const filterSlots = useCallback(
    ([id, doc]) => id.startsWith(`${path}/`) && doc.projectId === projectId,
    [path, projectId],
  );
  return useExtractDb(key, filterSlots, path);
}

function useExtractDbDoc(path) {
  return useSelector((state) => {
    return {
      error: state.db.__errors__[path],
      isLoading: state.db.__loading__[path],
      data: state.db[path],
    };
  });
}

// Person document should be listened, so read Redux state.
export function usePerson() {
  const personId = usePersonId();
  const path = personId ? `persons/${personId}` : undefined;
  return useExtractDbDoc(path);
}

// Listens to a document and returns document data.
export function useDoc(path) {
  useListenDoc(path);
  return useExtractDbDoc(path);
}

// Listens to project document and returns data.
export function useProject(id) {
  return useDoc(`projects/${id}`);
}
