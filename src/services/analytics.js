import { getAnalytics, logEvent } from 'firebase/analytics';

let analytics;

export function initAnalytics() {
  analytics = getAnalytics();
}

export function logSignInError(code) {
  logEvent(analytics, 'sign_in_error', { code });
}

export function logUpdatePerson() {
  logEvent(analytics, 'update_person');
}

export function logSignIn(method) {
  logEvent(analytics, 'login', { method });
}

export function logSignOut() {
  logEvent(analytics, 'sign_out');
}

export function logSignUp(method) {
  logEvent(analytics, 'sign_up', { method });
}
