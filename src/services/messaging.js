import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

import {
  addRegistrationToken,
  deleteRegistrationToken,
  getExistingFcmToken,
  touchRegistrationToken,
  useUid,
} from './db';
import { getApp } from './firebase';
import { setDocId, setToken } from '../redux/slices/fcm';

let messaging;

export function initMessaging() {
  messaging = getMessaging(getApp());
  onMessage(messaging, (payload) => {
    console.debug('Message received', payload);
  });
}

function useGetToken() {
  const dispatch = useDispatch();
  useEffect(() => {
    const run = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        });
        if (token) {
          dispatch(setToken(token));
        } else {
          console.debug(
            'No registration token available. Request permission to generate one.',
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    run();
  }, [dispatch]);
  return useSelector((state) => state.fcm.token);
}

// const TOKEN_REFRESH_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days
const TOKEN_REFRESH_TIME = 1000 * 60 * 60; // 1 hour

// Returns true if given timestamp is older than REFRESH_TIME from now.
const shouldBeRefreshed = (updated) => {
  const now = new Date().getTime();
  return now - updated >= TOKEN_REFRESH_TIME;
};

export function useRegistrationToken() {
  const uid = useUid();
  const token = useGetToken();
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized && uid && token) {
      // run this only once
      setInitialized(true);
      const run = async () => {
        try {
          const [id, doc] = await getExistingFcmToken(uid, token);
          if (doc) {
            // this token exists already in db
            if (shouldBeRefreshed(doc.updated)) {
              await touchRegistrationToken(id, uid);
            }
            dispatch(setDocId(id));
          } else {
            // this token does not exist in db, add it
            const docId = await addRegistrationToken(uid, token);
            dispatch(setDocId(docId));
          }
        } catch (err) {
          console.error(err);
        }
      };
      run();
    }
  }, [initialized, uid, token, dispatch]);
}

// Hook that deletes fcmToken document that is currently in use.
export function useDeleteRegistrationToken() {
  const [deleted, setDeleted] = useState(false);
  const { docId } = useSelector((state) => state.fcm);
  useEffect(() => {
    if (docId) {
      const run = async () => {
        try {
          await deleteRegistrationToken(docId);
          setDeleted(true);
        } catch (err) {
          console.error(err);
        }
      };
      run();
    }
  }, [docId]);
  return deleted || !docId;
}
