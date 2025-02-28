import React from 'react';
import { Notification } from '../types';
import { format } from 'date-fns';
import { Bell, CheckCircle, AlertTriangle, DollarSign, Info } from 'lucide-react';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onViewJob?: (jobId: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  onMarkAsRead,
  onViewJob
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'new-job':
        return <Bell className="h-5 w-5 text-green-500" />;
      case 'job-update':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center py-6">
        <Bell className="h-12 w-12 text-gray-300 mx-auto" />
        <p className="mt-2 text-gray-500">No notifications yet</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {notifications.map((notification) => (
        <li 
          key={notification.id} 
          className={`p-4 ${notification.read ? 'bg-white' : 'bg-green-50'}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-xs text-gray-500">
                  {format(notification.createdAt, 'MMM dd, h:mm a')}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
              <div className="mt-2 flex space-x-2">
                {!notification.read && (
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    Mark as read
                  </button>
                )}
                {notification.jobId && onViewJob && (
                  <button
                    onClick={() => onViewJob(notification.jobId!)}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    View job
                  </button>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NotificationList;