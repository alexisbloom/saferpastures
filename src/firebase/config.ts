import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

// Your web app's Firebase configuration
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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);

export default app;