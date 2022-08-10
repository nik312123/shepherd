import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/messaging';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize components
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const fieldValue = firebase.firestore.FieldValue;
let messagingTmp;
try {
    messagingTmp = firebase.messaging();
}
catch(ignored) {
    messagingTmp = null;
}
export const messaging = messagingTmp;
