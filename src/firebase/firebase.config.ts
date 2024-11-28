import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyC9aT42u85754Aqg4wql9fdz3HDdxxqecs",
  authDomain: "bigamtsk-75449.firebaseapp.com",
  databaseURL: "https://bigamtsk-75449-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bigamtsk-75449",
  storageBucket: "bigamtsk-75449.firebasestorage.app",
  messagingSenderId: "1021078077592",
  appId: "1:1021078077592:web:c9aa8556e835922e0b90ed",
  measurementId: "G-8RCLZGE59K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
