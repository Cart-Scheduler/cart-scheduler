/* eslint-disable no-undef */

// These scripts are available only when the app is served on Firebase Hosting
importScripts('/__/firebase/9.22.0/firebase-app-compat.js');
importScripts('/__/firebase/9.22.0/firebase-messaging-compat.js');
importScripts('/__/firebase/init.js');

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
});
