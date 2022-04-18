import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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

// initialize components
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();
