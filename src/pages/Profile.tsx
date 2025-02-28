import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Truck, Star, Edit, Save, AlertTriangle } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { userProfile, currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleRegistration, setVehicleRegistration] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (userProfile) {
      setName(userProfile.name || '');
      setVehicleType(userProfile.vehicleDetails?.type || '');
      setVehicleRegistration(userProfile.vehicleDetails?.registrationNumber || '');
      setVehicleCapacity(userProfile.vehicleDetails?.capacity || '');
    }
  }, [userProfile, currentUser, navigate]);

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name,
        vehicleDetails: {
          type: vehicleType,
          registrationNumber: vehicleRegistration,
          capacity: vehicleCapacity
        }
      });
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your transporter profile and vehicle details.</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 p-4 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-100 p-4 rounded-md flex items-center">
          <Save className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                {userProfile.profilePicture ? (
                  <img 
                    src={userProfile.profilePicture} 
                    alt={userProfile.name} 
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-blue-600" />
                )}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">{userProfile.name}</h2>
                <p className="text-gray-600">
                  {userProfile.email || userProfile.phone || 'No contact info'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {isEditing ? (
                <>
                  <Edit className="h-4 w-4 mr-1" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                    Vehicle Type
                  </label>
                  <input
                    type="text"
                    id="vehicleType"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    placeholder="e.g., Livestock Trailer, Cattle Truck"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="vehicleRegistration" className="block text-sm font-medium text-gray-700">
                    Vehicle Registration Number
                  </label>
                  <input
                    type="text"
                    id="vehicleRegistration"
                    value={vehicleRegistration}
                    onChange={(e) => setVehicleRegistration(e.target.value)}
                    placeholder="e.g., ABC123"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="vehicleCapacity" className="block text-sm font-medium text-gray-700">
                    Vehicle Capacity
                  </label>
                  <input
                    type="text"
                    id="vehicleCapacity"
                    value={vehicleCapacity}
                    onChange={(e) => setVehicleCapacity(e.target.value)}
                    placeholder="e.g., 10 cattle, 20 sheep"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                  <p className="mt-1 text-sm text-gray-900">{userProfile.name || 'Not set'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {userProfile.email || userProfile.phone || 'Not set'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Vehicle Type</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {userProfile.vehicleDetails?.type || 'Not set'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Vehicle Registration</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {userProfile.vehicleDetails?.registrationNumber || 'Not set'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Vehicle Capacity</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {userProfile.vehicleDetails?.capacity || 'Not set'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Trips</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {userProfile.totalTrips || 0}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Rating & Performance</h3>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Rating</p>
                <div className="flex items-center mt-1">
                  <p className="text-2xl font-bold text-gray-900 mr-2">
                    {userProfile.rating ? userProfile.rating.toFixed(1) : 'N/A'}
                  </p>
                  {userProfile.rating && (
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(userProfile.rating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Completed Trips</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {userProfile.totalTrips || 0}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {userProfile.createdAt ? new Date(userProfile.createdAt).getFullYear() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;