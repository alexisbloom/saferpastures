import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Clock, AlertTriangle, Bell } from 'lucide-react';
import JobCard from '../components/JobCard';
import { TransportJob } from '../types';
import { useAuth } from '../context/AuthContext';
import { requestNotificationPermission } from '../utils/notificationUtils';
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Dashboard: React.FC = () => {
  const [pendingJobs, setPendingJobs] = useState<TransportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Simple query without orderBy to avoid index issues
        const jobsRef = collection(db, 'jobs');
        const q = query(jobsRef, where('status', '==', 'pending'));
        const snapshot = await getDocs(q);
        
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
        
        setPendingJobs(jobs);
      } catch (err) {
        setError('Failed to load jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();

    // Subscribe to real-time updates without orderBy
    const jobsRef = collection(db, 'jobs');
    const q = query(jobsRef, where('status', '==', 'pending'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
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
      
      setPendingJobs(jobs);
    });

    // Check notification permission
    if ('Notification' in window && window.Notification.permission !== 'granted' && window.Notification.permission !== 'denied') {
      setShowNotificationPrompt(true);
    }

    return () => unsubscribe();
  }, []);

  const handleAcceptJob = async (jobId: string) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        transporterId: currentUser.uid,
        status: 'accepted',
        acceptedAt: new Date()
      });
      navigate(`/jobs/${jobId}`);
    } catch (err) {
      console.error('Failed to accept job:', err);
      setError('Failed to accept job. Please try again.');
    }
  };

  const handleViewJobDetails = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setShowNotificationPrompt(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to Safer Pastures</h1>
        <p className="text-gray-600">Find and manage livestock transport jobs as a trusted transporter.</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 p-4 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {showNotificationPrompt && (
        <div className="mb-4 bg-blue-50 p-4 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-blue-700">Enable notifications to get alerts about new jobs and updates.</span>
          </div>
          <button
            onClick={handleEnableNotifications}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Enable
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingJobs.length > 0 ? (
          pendingJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onAccept={handleAcceptJob}
              onViewDetails={handleViewJobDetails}
            />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-md p-6 text-center">
            <Truck className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs available</h3>
            <p className="text-gray-500">
              There are currently no pending transport jobs. Check back later!
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Clock className="h-6 w-6 text-green-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-500 text-center py-4">
            Your recent activity will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;