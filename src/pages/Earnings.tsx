import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Calendar, TrendingUp, AlertTriangle, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Earnings } from '../types';
import { getTransporterEarnings, calculateTotalEarnings } from '../services/earningsService';
import { useAuth } from '../context/AuthContext';

const EarningsPage: React.FC = () => {
  const [earnings, setEarnings] = useState<Earnings[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchEarnings = async () => {
      try {
        const earningsData = await getTransporterEarnings(currentUser.uid);
        setEarnings(earningsData);
        
        const total = await calculateTotalEarnings(currentUser.uid);
        setTotalEarnings(total);
      } catch (err) {
        console.error('Failed to load earnings:', err);
        setError('Failed to load earnings data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [currentUser, navigate]);

  const getFilteredEarnings = () => {
    if (!earnings.length) return [];
    
    const now = new Date();
    let cutoffDate = new Date();
    
    if (timeframe === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeframe === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else {
      cutoffDate.setFullYear(now.getFullYear() - 1);
    }
    
    return earnings.filter(earning => earning.createdAt >= cutoffDate);
  };

  const filteredEarnings = getFilteredEarnings();
  
  const calculateTimeframeTotal = () => {
    return filteredEarnings.reduce((total, earning) => {
      return total + (earning.status === 'completed' ? earning.amount : 0);
    }, 0);
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-600">Track your transport earnings and payment history.</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 p-4 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <DollarSign className="h-5 w-5 text-green-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Total Earnings</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Lifetime earnings</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">{timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}ly Earnings</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">${calculateTimeframeTotal().toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Last {timeframe}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Completed Trips</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {earnings.filter(e => e.status === 'completed').length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total paid trips</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Earnings History</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="border border-gray-300 rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
            
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
        </div>
        
        {filteredEarnings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEarnings.map((earning) => (
                  <tr key={earning.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(earning.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                      <button onClick={() => navigate(`/jobs/${earning.jobId}`)}>
                        {earning.jobId.substring(0, 8)}...
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${earning.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        earning.status === 'completed' ? 'bg-green-100 text-green-800' :
                        earning.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {earning.paidAt ? formatDate(earning.paidAt) : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No earnings found</h3>
            <p className="text-gray-500">
              {earnings.length > 0
                ? `No earnings in the selected time period. Try changing the filter.`
                : `You haven't completed any paid trips yet.`}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Earnings Breakdown</h2>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">This feature will show a detailed breakdown of your earnings by category, time period, and job type.</p>
          <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Earnings chart will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;