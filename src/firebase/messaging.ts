import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';

// Initialize Firebase Messaging
const initializeMessaging = async (userId: string) => {
  try {
    // Check if the browser supports service workers
    if ('serviceWorker' in navigator) {
      const messaging = getMessaging();
      
      // Request permission and get token
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      
      // Get token and save it to Firestore
      const currentToken = await getToken(messaging, { 
        vapidKey,
        serviceWorkerRegistration: await navigator.serviceWorker.getRegistration()
      });
      
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        
        // Save the token to the user's document in Firestore
        await saveTokenToFirestore(userId, currentToken);
        
        // Set up message handler
        setupMessageHandler(messaging);
        
        return currentToken;
      } else {
        console.log('No registration token available. Request permission to generate one.');
        return null;
      }
    } else {
      console.log('Service workers are not supported in this browser.');
      return null;
    }
  } catch (error) {
    console.error('Error initializing messaging:', error);
    return null;
  }
};

// Save FCM token to Firestore
const saveTokenToFirestore = async (userId: string, token: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Update the user document with the FCM token
      await setDoc(userRef, {
        fcmTokens: {
          [token]: true
        }
      }, { merge: true });
      
      console.log('Token saved to Firestore');
    }
  } catch (error) {
    console.error('Error saving token to Firestore:', error);
  }
};

// Set up message handler for foreground messages
const setupMessageHandler = (messaging: any) => {
  onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    
    // Display a notification if the app is in the foreground
    if (payload.notification) {
      const { title, body } = payload.notification;
      
      // Check if the browser supports notifications
      if ('Notification' in window && window.Notification.permission === 'granted') {
        const notificationOptions = {
          body,
          icon: '/vite.svg', // Use your app icon
          data: payload.data
        };
        
        // Create and show notification
        new window.Notification(title as string, notificationOptions);
      }
    }
  });
};

export { initializeMessaging };