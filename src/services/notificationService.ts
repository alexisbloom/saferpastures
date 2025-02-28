import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc,
  doc,
  Timestamp,
  onSnapshot,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Notification } from '../types';

// Get notifications for a user
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const notificationsQuery = query(
    collection(db, 'notifications'),
    where('userId', '==', userId)
  );
  
  const snapshot = await getDocs(notificationsQuery);
  const notifications = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  } as Notification));
  
  // Sort manually client-side
  return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// Create a notification
export const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>): Promise<string> => {
  const notificationData = {
    ...notification,
    createdAt: Timestamp.now()
  };
  
  const docRef = await addDoc(collection(db, 'notifications'), notificationData);
  return docRef.id;
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, { read: true });
};

// Subscribe to user notifications
export const subscribeToUserNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void
) => {
  const notificationsQuery = query(
    collection(db, 'notifications'),
    where('userId', '==', userId)
  );
  
  return onSnapshot(notificationsQuery, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Notification));
    
    // Sort manually client-side
    notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    callback(notifications);
  });
};

// Create a job notification for transporters
export const createJobNotification = async (jobId: string, jobTitle: string): Promise<void> => {
  // In a real app, you would query for all transporters and create a notification for each
  // For this example, we'll just create a mock notification
  await createNotification({
    userId: 'all-transporters', // In a real app, this would be specific transporter IDs
    title: 'New Job Available',
    message: `New job available: ${jobTitle}`,
    type: 'new-job',
    read: false,
    jobId
  });
};

// Send push notification to a user
export const sendPushNotification = async (userId: string, title: string, body: string, data?: any) => {
  try {
    // Get user's FCM tokens
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return;
    
    const userData = userDoc.data();
    const fcmTokens = userData.fcmTokens || {};
    
    // If no tokens, return
    if (Object.keys(fcmTokens).length === 0) return;
    
    // Create notification in Firestore
    await createNotification({
      userId,
      title,
      message: body,
      type: data?.type || 'system',
      read: false,
      jobId: data?.jobId
    });
    
    // In a real app, you would call a Cloud Function or backend API to send the push notification
    console.log(`Push notification would be sent to user ${userId} with tokens:`, Object.keys(fcmTokens));
    
    // For testing purposes, we'll simulate a push notification if we're in the browser
    if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification(title, { body });
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};