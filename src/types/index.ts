export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  profilePicture?: string;
  vehicleDetails?: {
    type: string;
    registrationNumber: string;
    capacity: string;
  };
  rating?: number;
  totalTrips?: number;
  isOnline?: boolean;
  createdAt: Date;
  settings?: {
    notifications?: boolean;
    location?: boolean;
    darkMode?: boolean;
  };
  fcmTokens?: Record<string, boolean>;
}

export interface TransportJob {
  id: string;
  customerId: string;
  customerName: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  pickupLocation: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  dropoffLocation: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  pickupTime: Date;
  estimatedDistance: number;
  estimatedDuration: number;
  price: number;
  livestockDetails: {
    type: string;
    quantity: number;
    weight?: number;
    specialRequirements?: string;
  };
  transporterId?: string;
  acceptedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'new-job' | 'job-update' | 'payment' | 'system';
  read: boolean;
  jobId?: string;
  createdAt: Date;
}

export interface Earnings {
  id: string;
  transporterId: string;
  jobId: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  paidAt?: Date;
  createdAt: Date;
}