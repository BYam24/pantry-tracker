// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_FIREBASE_API_KEY,
  authDomain: "pantry-tracker-ee1bb.firebaseapp.com",
  projectId: "pantry-tracker-ee1bb",
  storageBucket: "pantry-tracker-ee1bb.appspot.com",
  messagingSenderId: "157913652020",
  appId: "1:157913652020:web:4277fb07d1f50c40862361",
  measurementId: "G-6SCDFQ21ZR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { firestore, analytics, storage };
