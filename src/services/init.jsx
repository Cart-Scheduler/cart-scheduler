import { useEffect, useState } from 'react';
import { initAuth } from './auth';
import { initLocales } from '../i18next';
import { initFirebase } from './firebase';
import { initDb } from './db';
import { initFunctions } from './functions';
import { initMessaging } from './messaging';

export function InitApp({ children }) {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    initLocales();
    initFirebase();

    initAuth();
    initDb();
    initFunctions();
    initMessaging();
    setInitialized(true);
  }, []);
  if (initialized) {
    return children;
  }
  return null;
}
