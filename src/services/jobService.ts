import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  onSnapshot,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { TransportJob } from '../types';
import { sendPushNotification } from './notificationService';

// Get all pending jobs
export const getPendingJobs = async (): Promise<TransportJob[]> => {
  const jobsQuery = query(
    collection(db, 'jobs'),
    where('status', '==', 'pending')
  );
  
  const snapshot = await getDocs(jobsQuery);
  const jobs = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    pickupTime: doc.data().pickupTime.toDate(),
    createdAt: doc.data().createdAt.toDate(),
    ...(doc.data().acceptedAt && { acceptedAt: doc.data().acceptedAt.toDate() }),
    ...(doc.data().completedAt && { completedAt: doc.data().completedAt.toDate() })
  } as TransportJob));
  
  // Sort manually client-side
  return jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// Get jobs by transporter ID
export const getTransporterJobs = async (transporterId: string): Promise<TransportJob[]> => {
  const jobsQuery = query(
    collection(db, 'jobs'),
    where('transporterId', '==', transporterId)
  );
  
  const snapshot = await getDocs(jobsQuery);
  const jobs = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    pickupTime: doc.data().pickupTime.toDate(),
    createdAt: doc.data().createdAt.toDate(),
    ...(doc.data().acceptedAt && { acceptedAt: doc.data().acceptedAt.toDate() }),
    ...(doc.data().completedAt && { completedAt: doc.data().completedAt.toDate() })
  } as TransportJob));
  
  // Sort manually client-side
  return jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// Get job by ID
export const getJobById = async (jobId: string): Promise<TransportJob | null> => {
  const jobDoc = await getDoc(doc(db, 'jobs', jobId));
  
  if (!jobDoc.exists()) {
    return null;
  }
  
  const data = jobDoc.data();
  return {
    id: jobDoc.id,
    ...data,
    pickupTime: data.pickupTime.toDate(),
    createdAt: data.createdAt.toDate(),
    ...(data.acceptedAt && { acceptedAt: data.acceptedAt.toDate() }),
    ...(data.completedAt && { completedAt: data.completedAt.toDate() })
  } as TransportJob;
};

// Accept a job
export const acceptJob = async (jobId: string, transporterId: string): Promise<void> => {
  const jobRef = doc(db, 'jobs', jobId);
  const jobDoc = await getDoc(jobRef);
  
  if (!jobDoc.exists()) {
    throw new Error('Job not found');
  }
  
  const jobData = jobDoc.data();
  
  await updateDoc(jobRef, {
    transporterId,
    status: 'accepted',
    acceptedAt: Timestamp.now()
  });
  
  // Send notification to the customer
  if (jobData.customerId) {
    await sendPushNotification(
      jobData.customerId,
      'Job Accepted',
      `Your ${jobData.livestockDetails.type} transport job has been accepted by a transporter.`,
      { jobId, type: 'job-update' }
    );
  }
};

// Update job status
export const updateJobStatus = async (
  jobId: string, 
  status: 'accepted' | 'in-progress' | 'completed' | 'cancelled'
): Promise<void> => {
  const jobRef = doc(db, 'jobs', jobId);
  const jobDoc = await getDoc(jobRef);
  
  if (!jobDoc.exists()) {
    throw new Error('Job not found');
  }
  
  const jobData = jobDoc.data();
  
  const updates: any = { status };
  
  if (status === 'completed') {
    updates.completedAt = Timestamp.now();
  }
  
  await updateDoc(jobRef, updates);
  
  // Send notification to the customer
  if (jobData.customerId) {
    let title = '';
    let message = '';
    
    switch (status) {
      case 'in-progress':
        title = 'Transport Started';
        message = `Your ${jobData.livestockDetails.type} transport is now in progress.`;
        break;
      case 'completed':
        title = 'Transport Completed';
        message = `Your ${jobData.livestockDetails.type} transport has been completed.`;
        break;
      case 'cancelled':
        title = 'Transport Cancelled';
        message = `Your ${jobData.livestockDetails.type} transport has been cancelled.`;
        break;
    }
    
    if (title && message) {
      await sendPushNotification(
        jobData.customerId,
        title,
        message,
        { jobId, type: 'job-update' }
      );
    }
  }
};

// Listen to job updates
export const subscribeToJob = (
  jobId: string, 
  callback: (job: TransportJob) => void
) => {
  const jobRef = doc(db, 'jobs', jobId);
  
  return onSnapshot(jobRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback({
        id: doc.id,
        ...data,
        pickupTime: data.pickupTime.toDate(),
        createdAt: data.createdAt.toDate(),
        ...(data.acceptedAt && { acceptedAt: data.acceptedAt.toDate() }),
        ...(data.completedAt && { completedAt: data.completedAt.toDate() })
      } as TransportJob);
    }
  });
};

// Listen to pending jobs
export const subscribeToPendingJobs = (
  callback: (jobs: TransportJob[]) => void
) => {
  const jobsQuery = query(
    collection(db, 'jobs'),
    where('status', '==', 'pending')
  );
  
  return onSnapshot(jobsQuery, (snapshot) => {
    const jobs = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        pickupTime: data.pickupTime.toDate(),
        createdAt: data.createdAt.toDate(),
        ...(data.acceptedAt && { acceptedAt: data.acceptedAt.toDate() }),
        ...(data.completedAt && { completedAt: data.completedAt.toDate() })
      } as TransportJob;
    });
    
    // Sort manually client-side
    jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    callback(jobs);
  });
};

// Create a mock job (for development purposes)
export const createMockJob = async (): Promise<string> => {
  const mockJob = {
    customerId: 'mock-customer-id',
    customerName: 'Mock Customer',
    status: 'pending',
    pickupLocation: {
      address: '123 Farm Road, Rural County',
      coordinates: {
        lat: 40.712776,
        lng: -74.005974
      }
    },
    dropoffLocation: {
      address: '456 Market Street, City Center',
      coordinates: {
        lat: 40.730610,
        lng: -73.935242
      }
    },
    pickupTime: Timestamp.fromDate(new Date(Date.now() + 86400000)), // 24 hours from now
    estimatedDistance: 25.4,
    estimatedDuration: 45, // minutes
    price: 350,
    livestockDetails: {
      type: 'Cattle',
      quantity: 5,
      weight: 2500,
      specialRequirements: 'Handle with care, animals are pregnant'
    },
    createdAt: Timestamp.now()
  };
  
  const docRef = await addDoc(collection(db, 'jobs'), mockJob);
  
  // Send notification to all transporters
  // In a real app, you would query for all transporters and send notifications to each
  // For this example, we'll just log it
  console.log(`New job created: ${docRef.id}`);
  
  return docRef.id;
};