import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { addRegistrationToken } from './firebase';

const messaging = getMessaging();

export async function setupMessaging(uid, user) {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
    });
    if (currentToken) {
      const existing = user?.regTokens ?? [];
      if (!existing.includes(currentToken)) {
        // add the new token to Firestore
        await addRegistrationToken(uid, currentToken);
      }
    } else {
      // request permission from user for sending push notifications
      console.debug(
        'No registration token available. Request permission to generate one.',
      );
    }
  } catch (err) {
    console.error(err);
  }
}

onMessage(messaging, (payload) => {
  console.debug('Message received', payload);
});
