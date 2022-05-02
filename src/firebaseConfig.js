import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/messaging';
import 'firebase/storage';

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
