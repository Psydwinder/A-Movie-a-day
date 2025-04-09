'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Debug log to verify config
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'exists' : 'missing',
  authDomain: firebaseConfig.authDomain ? 'exists' : 'missing',
  projectId: firebaseConfig.projectId ? 'exists' : 'missing',
  storageBucket: firebaseConfig.storageBucket ? 'exists' : 'missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'exists' : 'missing',
  appId: firebaseConfig.appId ? 'exists' : 'missing'
});

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
console.log('Firebase initialized successfully');

// Initialize Auth with error handling
const auth = getAuth(app);
console.log('Auth initialized:', auth.currentUser ? 'User present' : 'No user');

// Initialize Firestore
const db = getFirestore(app);

// Set persistence to local
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Auth persistence set to local');
    })
    .catch((error) => {
      console.error('Error setting auth persistence:', error);
    });
}

const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider }; 