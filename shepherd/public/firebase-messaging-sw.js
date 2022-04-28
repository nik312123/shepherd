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

self.addEventListener('notificationclick',  (event) => {
    console.log('SW notification click event', JSON.stringify(event));
    let url = event.webpush.fcmOptions.link;

    event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
})

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