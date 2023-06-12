import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

//web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDanuE07HSNqpIhBYtAGTx0L3apjyb6bsU",
    authDomain: "cyber-chat1.firebaseapp.com",
    projectId: "cyber-chat1",
    storageBucket: "cyber-chat1.appspot.com",
    messagingSenderId: "270223317803",
    appId: "1:270223317803:web:83032dd1f1fa782c10c36e",
    measurementId: "G-KZ8TD30X64"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();