// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// --- IMPORTANT ---
// Replace this with your own Firebase project's configuration object.
// You can find this in your Firebase project settings under "General".
const firebaseConfig = {
  apiKey: 'AIzaSyBZniBrZCyss4JxJNoolQDxhKirfTtAJqE',
  authDomain: 'mobile-shop-app-3f4c0.firebaseapp.com',
  projectId: 'mobile-shop-app-3f4c0',
  storageBucket: 'mobile-shop-app-3f4c0.firebasestorage.app',
  messagingSenderId: '389145568053',
  appId: '1:389145568053:web:8fa2089d094d906f00a27c',
  measurementId: 'G-1S9BTTJXLC',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
