/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');


const firebaseConfig = {
    apiKey: "***REMOVED***",
    authDomain: "shepherd-be6df.firebaseapp.com",
    projectId: "shepherd-be6df",
    storageBucket: "shepherd-be6df.appspot.com",
    messagingSenderId: "***REMOVED***",
    appId: "***REMOVED***"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions).then(r => {
        console.log('[firebase-messaging-sw.js] Notification shown', r);
    });
});