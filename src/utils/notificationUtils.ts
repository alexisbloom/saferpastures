// Check if the browser supports notifications
export const checkNotificationSupport = (): boolean => {
  return 'Notification' in window;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!checkNotificationSupport()) {
    console.log('This browser does not support notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Display a notification
export const showNotification = (title: string, options?: NotificationOptions): void => {
  if (!checkNotificationSupport()) {
    console.log('This browser does not support notifications');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return;
  }

  try {
    // Use the browser's Notification API directly
    new window.Notification(title, options);
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};