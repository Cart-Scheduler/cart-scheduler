import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  createUserWithEmailAndPassword,
  getAuth,
  getRedirectResult,
  isSignInWithEmailLink,
  onAuthStateChanged,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut as signOutFirebase,
  GoogleAuthProvider,
  OAuthProvider,
} from 'firebase/auth';

import { logSignIn, logSignInError, logSignOut, logSignUp } from './analytics';
import { reset } from '../redux/actions';
import { setError, setUser } from '../redux/slices/auth';

let auth;

export function initAuth() {
  auth = getAuth();
  if (process.env.REACT_APP_LANGUAGE) {
    auth.languageCode = process.env.REACT_APP_LANGUAGE;
  }
}

// Custom hook for authentication. Returns:
// - undefined = still figuring out
// - null = user is not authenticated
// - authenticated user object
export function useListenAuth() {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        const newUser = user
          ? {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            }
          : user;
        dispatch(setUser(newUser));
      },
      (err) => {
        console.error(err);
        dispatch(setError({ code: err.code, message: err.message }));
        logSignInError(err.code);
      },
    );
    return unsubscribe;
  }, [dispatch]);
}

const SAVED_SIGN_IN_EMAIL_KEY = 'emailForSignIn';

export function saveSignInEmail(email) {
  window.localStorage.setItem(SAVED_SIGN_IN_EMAIL_KEY, email);
}

export function readSavedSignInEmail() {
  return window.localStorage.getItem(SAVED_SIGN_IN_EMAIL_KEY);
}

export async function appleSignIn() {
  const provider = new OAuthProvider('apple.com');

  // scopes that we want to request from Apple
  provider.addScope('email');
  provider.addScope('name');

  if (process.env.REACT_APP_LANGUAGE) {
    provider.setCustomParameters({
      locale: process.env.REACT_APP_LANGUAGE,
    });
  }

  await signInWithRedirect(auth, provider);
  logSignIn('Apple');
}

export function useCheckRedirectResult() {
  const dispatch = useDispatch();
  useEffect(() => {
    const run = async () => {
      try {
        await getRedirectResult(auth);
      } catch (err) {
        console.error(err);
        dispatch(setError({ code: err.code, message: err.message }));
        logSignInError(err.code);
      }
    };
    run();
  }, [dispatch]);
}

// https://firebase.google.com/docs/auth/web/redirect-best-practices

export async function googleSignIn() {
  const provider = new GoogleAuthProvider();

  // scopes that we want to request from Google API
  provider.addScope('email');
  provider.addScope('profile');

  await signInWithRedirect(auth, provider);
  logSignIn('Google');
}

// Query parameter key to be used for next path information while using
// email link authentication. Simple key like 'next' can conflict with
// query parameters that Google is using in the authentication.
export const QUERY_PARAM_NEXT = '_csNext';

// Returns URL that is used in email link authentication as continue URL.
const getEmailLinkUrl = (next) => {
  const server = process.env.REACT_APP_EMAIL_LINK_AUTH_URL ?? 'undefined';
  let url = `${server}/signin/link`;
  if (next) {
    const params = new URLSearchParams();
    params.set(QUERY_PARAM_NEXT, next);
    url += '?' + params.toString();
  }
  return url;
};

export async function signInLinkToEmail(email, next) {
  const actionCodeSettings = {
    url: getEmailLinkUrl(next),
    handleCodeInApp: true, // must be true
  };

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  logSignIn('EmailLink');
}

export async function signInPassword(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
  logSignIn('EmailPassword');
}

export async function signUpPassword(email, password) {
  await createUserWithEmailAndPassword(auth, email, password);
  logSignUp('EmailPassword');
}

export function useSignOut() {
  const dispatch = useDispatch();
  const [signedOut, setSignedOut] = useState(false);
  useEffect(() => {
    const start = async () => {
      try {
        await signOutFirebase(auth);
        // re-initialize redux state by dispatching reset action
        dispatch(reset());
        setSignedOut(true);
        logSignOut();
      } catch (err) {
        console.error(err);
      }
    };
    start();
  }, [dispatch]);
  return signedOut;
}

export function isValidSignInLink(link) {
  return isSignInWithEmailLink(auth, link);
}

export function useSignInWithEmailLink(email, link) {
  const [result, setResult] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    const start = async () => {
      try {
        const res = await signInWithEmailLink(auth, email, link);
        // remove saved email address
        window.localStorage.removeItem(SAVED_SIGN_IN_EMAIL_KEY);
        setResult(res);
      } catch (err) {
        setError(err);
        logSignInError(err.code);
      }
    };
    if (email && link) {
      start();
    }
  }, [email, link]);
  return [result, error];
}
