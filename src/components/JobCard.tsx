import React from 'react';
import { TransportJob } from '../types';
import { format } from 'date-fns';
import { MapPin, Clock, DollarSign, Truck } from 'lucide-react';

interface JobCardProps {
  job: TransportJob;
  onAccept?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onAccept, onViewDetails }) => {
  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy h:mm a');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">
            {job.livestockDetails.type} Transport
          </h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            job.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
            job.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
            job.status === 'completed' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          <p>Customer: {job.customerName}</p>
          <p className="mt-1">
            <span className="font-medium">{job.livestockDetails.quantity}</span> {job.livestockDetails.type}
            {job.livestockDetails.weight && ` (${job.livestockDetails.weight} kg)`}
          </p>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Pickup</p>
              <p className="text-sm">{job.pickupLocation.address}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Dropoff</p>
              <p className="text-sm">{job.dropoffLocation.address}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Pickup Time</p>
              <p className="text-sm">{formatDate(job.pickupTime)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Truck className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Distance</p>
              <p className="text-sm">{job.estimatedDistance} km ({job.estimatedDuration} min)</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Payment</p>
              <p className="text-sm font-semibold">${job.price.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          {job.status === 'pending' && onAccept && (
            <button
              onClick={() => onAccept(job.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Accept Job
            </button>
          )}
          
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(job.id)}
              className={`${job.status === 'pending' && onAccept ? 'flex-1' : 'w-full'} bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;