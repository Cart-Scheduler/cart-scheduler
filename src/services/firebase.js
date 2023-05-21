import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
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

// Get the values from Firebase console and write env vars into .env.local
// file.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

let db;

export function initFirebase() {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
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

// Returns Firestore document data.
export async function fetchDoc(path) {
  const ref = doc(db, path);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : undefined;
}

// Custom hook wrapper for fetchDoc.
export function useFetchDoc(path) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (path) {
      const start = async () => {
        setIsLoading(true);
        const docData = await fetchDoc(path);
        setData(docData ? docData : null);
        setIsLoading(false);
      };
      start();
    }
  }, [path]);
  return { data, isLoading };
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

export function useListenDoc(path, options = {}) {
  const skip = options.skip ?? false;
  const [data, setData] = useState();
  useEffect(() => {
    if (!skip) {
      const ref = doc(db, path);
      const unsubscribe = onSnapshot(ref, (doc) => {
        setData(serializableClone(doc.data()));
      });
      return unsubscribe;
    }
  }, [path, skip]);
  return data;
}

// Adds given registration token to user document.
export async function addRegistrationToken(uid, token) {
  await updateDoc(`users/${uid}`, {
    regTokens: arrayUnion(token),
    modified: serverTimestamp(),
  });
}

export async function getTestDoc() {
  const data = await fetchDoc('removeme/001');
  return serializableClone(data);
}

export async function getTestDocs() {
  const testQuery = (ref) => query(ref, where('test', '==', 'hello'));
  const docs = await fetchDocs('removeme', testQuery);
  return docs;
}
