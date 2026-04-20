import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2EcjDus0vbJD-Zs8Je9JQJnYwCyd8KpA",
  authDomain: "civic-reporter-2007.firebaseapp.com",
  projectId: "civic-reporter-2007",
  storageBucket: "civic-reporter-2007.appspot.com",
  messagingSenderId: "663896917066",
  appId: "1:663896917066:web:1f5c381ea68dd5173512b3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
