// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9uoH2lggOMIAVMjZpLxx-jHAm1Nz0FvM",
  authDomain: "bodaxgamingweb.firebaseapp.com",
  projectId: "bodaxgamingweb",
  storageBucket: "bodaxgamingweb.firebasestorage.app",
  messagingSenderId: "601479431781",
  appId: "1:601479431781:web:304d9d62ba0bb1fefd288c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Storage with explicit bucket name
export const storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);

export default app;

