// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: "abucay-3c3fd.firebaseapp.com",
  projectId: "abucay-3c3fd",
  storageBucket: "abucay-3c3fd.firebasestorage.app",
  messagingSenderId: "52466800697",
  appId: "1:52466800697:web:5144af5421a4fcaa5455e8",
  measurementId: "G-WMYRNKT6MW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);