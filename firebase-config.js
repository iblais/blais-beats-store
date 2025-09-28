// Firebase configuration for Blais Beats Store
// Replace with your Firebase config from console.firebase.google.com

const firebaseConfig = {
  // Get these from your Firebase project settings
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// For browser compatibility
window.firebaseApp = app;
window.firebaseDb = db;
window.firebaseStorage = storage;
window.firebaseAuth = auth;