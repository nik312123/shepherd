importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: '***REMOVED***',
    authDomain: 'shepherd-be6df.firebaseapp.com',
    projectId: 'shepherd-be6df',
    storageBucket: 'shepherd-be6df.appspot.com',
    messagingSenderId: '***REMOVED***',
    appId: '***REMOVED***'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

self.addEventListener('notificationclick', (event) => {
    const noteId = event.notification.data;
    clients.openWindow('/note/' + noteId);
    event.notification.close();
});

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './favicon.ico',
        image: payload.notification.image,
        data: payload.data.noteId
    };
    
    self.registration.showNotification(
        notificationTitle,
        notificationOptions
    ).then(r => {
        console.log('[firebase-messaging-sw.js] Notification shown', r);
    }).catch(e => {
        console.log('[firebase-messaging-sw.js] Notification error', e);
    });
});
