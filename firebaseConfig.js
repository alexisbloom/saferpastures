import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHL1YaJirLYf88yy9Q6Pj2XnFF3-2LAc0",
  authDomain: "saferpastures-mvp.firebaseapp.com",
  projectId: "saferpastures-mvp",
  storageBucket: "saferpastures-mvp.appspot.com",
  messagingSenderId: "666955104805",
  appId: "1:666955104805:web:9342bf8f15148eeb6175cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
