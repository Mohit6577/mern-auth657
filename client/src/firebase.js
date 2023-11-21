// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth657.firebaseapp.com",
  projectId: "mern-auth657",
  storageBucket: "mern-auth657.appspot.com",
  messagingSenderId: "381278441817",
  appId: "1:381278441817:web:781c9bb62ad8f49c45fc48"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);