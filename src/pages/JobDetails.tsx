import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign, 
  User, 
  Phone, 
  AlertTriangle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { TransportJob } from '../types';
import { getJobById, updateJobStatus, subscribeToJob } from '../services/jobService';
import GoogleMapComponent from '../components/GoogleMap';
import { useAuth } from '../context/AuthContext';

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<TransportJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        const jobData = await getJobById(jobId);
        if (jobData) {
          setJob(jobData);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        setError('Failed to load job details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToJob(jobId, (updatedJob) => {
      setJob(updatedJob);
    });

    return () => unsubscribe();
  }, [jobId]);

  const handleStatusUpdate = async (newStatus: 'in-progress' | 'completed' | 'cancelled') => {
    if (!job) return;

    try {
      await updateJobStatus(job.id, newStatus);
    } catch (err) {
      console.error('Failed to update job status:', err);
      setError('Failed to update job status. Please try again.');
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy h:mm a');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 p-4 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error || 'Job not found'}</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Go back
        </button>
      </div>
    );
  }

  const isAssignedToCurrentUser = job.transporterId === currentUser?.uid;
  const canUpdateStatus = isAssignedToCurrentUser && 
    (job.status === 'accepted' || job.status === 'in-progress');

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to jobs
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">
              {job.livestockDetails.type} Transport
            </h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
              job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              job.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
              job.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
              job.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{job.customerName}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Livestock</p>
                    <p className="font-medium">
                      {job.livestockDetails.quantity} {job.livestockDetails.type}
                      {job.livestockDetails.weight && ` (${job.livestockDetails.weight} kg)`}
                    </p>
                    {job.livestockDetails.specialRequirements && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Special requirements:</span> {job.livestockDetails.specialRequirements}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Pickup Location</p>
                    <p className="font-medium">{job.pickupLocation.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Dropoff Location</p>
                    <p className="font-medium">{job.dropoffLocation.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Pickup Time</p>
                    <p className="font-medium">{formatDate(job.pickupTime)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Distance & Duration</p>
                    <p className="font-medium">{job.estimatedDistance} km ({job.estimatedDuration} min)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Payment</p>
                    <p className="font-medium">${job.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {canUpdateStatus && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.status === 'accepted' && (
                      <button
                        onClick={() => handleStatusUpdate('in-progress')}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Start Transport
                      </button>
                    )}
                    
                    {job.status === 'in-progress' && (
                      <button
                        onClick={() => handleStatusUpdate('completed')}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Complete Job
                      </button>
                    )}
                    
                    {(job.status === 'accepted' || job.status === 'in-progress') && (
                      <button
                        onClick={() => handleStatusUpdate('cancelled')}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Cancel Job
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Route Map</h2>
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <GoogleMapComponent
                  pickupLocation={job.pickupLocation.coordinates}
                  dropoffLocation={job.dropoffLocation.coordinates}
                  showDirections={true}
                />
              </div>
              
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                  <span>Pickup</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                  <span>Dropoff</span>
                </div>
              </div>
              
              {job.status === 'completed' && (
                <div className="mt-6 bg-green-50 p-4 rounded-md">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <p className="font-medium text-green-800">Job completed</p>
                      <p className="text-sm text-green-700">
                        Completed on {job.completedAt ? formatDate(job.completedAt) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {job.status === 'cancelled' && (
                <div className="mt-6 bg-red-50 p-4 rounded-md">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <div>
                      <p className="font-medium text-red-800">Job cancelled</p>
                      <p className="text-sm text-red-700">
                        This job has been cancelled and is no longer active.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;