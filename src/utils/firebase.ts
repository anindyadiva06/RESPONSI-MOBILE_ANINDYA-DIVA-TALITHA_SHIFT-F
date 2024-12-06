// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyBBnA3jh_O8zFTuJYd74Pa2r7ixLyy6AZI",
    authDomain: "responsi-mobile-b7413.firebaseapp.com",
    projectId: "responsi-mobile-b7413",
    storageBucket: "responsi-mobile-b7413.firebasestorage.app",
    messagingSenderId: "184268950378",
    appId: "1:184268950378:web:20e28e21f0644e0de1b313",
    measurementId: "G-F0MZQYNHQJ"
  };

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export { auth, googleProvider, db };


