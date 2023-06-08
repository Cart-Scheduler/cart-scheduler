## Set Up Firebase

1. Log into Firebase Console.
1. Create a new project.
1. Add a new web app.
1. Copy `firebaseConfig` values and write them to `.env.local` file:

```ini
REACT_APP_FIREBASE_API_KEY="***"
REACT_APP_FIREBASE_AUTH_DOMAIN="***"
REACT_APP_FIREBASE_PROJECT_ID="***"
REACT_APP_FIREBASE_STORAGE_BUCKET="***"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="***"
REACT_APP_FIREBASE_APP_ID="***"
REACT_APP_MEASUREMENT_ID="***"
```

1. Create Firestore Database.
1. Add wanted authentication methods.
1. Deploy [cloud functions](https://github.com/Cart-Scheduler/cloud-functions)
1. Configure web credentials for cloud messaging from project settings and write the public key to `.env.local` file: `REACT_APP_FIREBASE_VAPID`

## Firebase Email Localization

1. Log into Firebase Console.
1. Click **Authentication**
1. Click **Templates** tab
1. Change **Template language**

## Sign-In Methods

You can enable these sign-in methods from the Firebase Console:

* Email/Password
* Google
* Apple (requires Apple Developer Program)

It's recommended to enable email enumeration protection:
https://firebase.google.com/docs/auth/web/password-auth#enumeration-protection

Safari browsers might have problem with Google sign-in, please read this:
https://firebase.google.com/docs/auth/web/redirect-best-practices
