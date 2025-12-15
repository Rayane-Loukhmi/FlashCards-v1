import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDxd2VPbzHc___pkFEEPZoEQGq2Iw_Wt0",
  authDomain: "flashcardsv2-95fdb.firebaseapp.com",
  projectId: "flashcardsv2-95fdb",
  storageBucket: "flashcardsv2-95fdb.firebasestorage.app",
  messagingSenderId: "177163820436",
  appId: "1:177163820436:web:b7efee6f89316f309bc381",
  measurementId: "G-6JL88TXHWC"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw new Error('Firebase configuration is invalid. Please check your config/firebase.js file.');
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

