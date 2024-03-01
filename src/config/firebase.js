import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfdUfW49H4K5gIp92uLe1wz-mLPbCmj2U",
  authDomain: "fir-app-6eef1.firebaseapp.com",
  projectId: "fir-app-6eef1",
  storageBucket: "fir-app-6eef1.appspot.com",
  messagingSenderId: "295279739727",
  appId: "1:295279739727:web:75faa6e900b2e9771ffb3a",
  measurementId: "G-0B9ZL4ZEGN",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
const analytics = getAnalytics(app);
