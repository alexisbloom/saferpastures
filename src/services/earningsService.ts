import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Earnings } from '../types';

// Get earnings for a transporter
export const getTransporterEarnings = async (transporterId: string): Promise<Earnings[]> => {
  const earningsQuery = query(
    collection(db, 'earnings'),
    where('transporterId', '==', transporterId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(earningsQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    ...(doc.data().paidAt && { paidAt: doc.data().paidAt.toDate() })
  } as Earnings));
};

// Create an earnings record
export const createEarningsRecord = async (
  transporterId: string,
  jobId: string,
  amount: number
): Promise<string> => {
  const earningsData = {
    transporterId,
    jobId,
    amount,
    status: 'pending',
    createdAt: Timestamp.now()
  };
  
  const docRef = await addDoc(collection(db, 'earnings'), earningsData);
  return docRef.id;
};

// Calculate total earnings for a transporter
export const calculateTotalEarnings = async (transporterId: string): Promise<number> => {
  const earnings = await getTransporterEarnings(transporterId);
  return earnings
    .filter(earning => earning.status === 'completed')
    .reduce((total, earning) => total + earning.amount, 0);
};