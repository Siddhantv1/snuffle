import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNotification } from '../hooks/useNotification';
import { Link } from 'react-router-dom';
import { LoaderCircle, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

// Helper component to show the status with nice colors
const StatusBadge = ({ status }) => {
  let bgColor, textColor, Icon;

  switch (status) {
    case 'Approved':
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      Icon = CheckCircle;
      break;
    case 'Rejected':
      bgColor = 'bg-red-100';
      textColor = 'text-red-700';
      Icon = XCircle;
      break;
    default: // 'Pending'
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-700';
      Icon = Clock;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
    >
      <Icon size={16} />
      {status}
    </span>
  );
};

// Card component for a single application
const ApplicationCard = ({ application }) => {
  const { pet } = application;

  //safety check for Deleted or Not Found Pets
  if (!pet) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col sm:flex-row border-l-4 border-gray-400">
        <div className="p-5 w-full">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-gray-500 italic">Pet No Longer Available</h3>
            <StatusBadge status={application.status} />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            The pet associated with this application has been deleted.
          </p>
          <div className="border-t border-gray-200 mt-4 pt-4">
            <p className="text-sm text-gray-500">
              Submitted on: {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col sm:flex-row">
      {/* Pet Image */}
      <div className="sm:w-1/3">
        <img 
          className="w-full h-48 sm:h-full object-cover" 
          src={pet.image || 'https://www.placehold.co/400x400.png?text=No+Image+Available'} 
          alt={pet.name} 
        />
      </div>
      
      {/* Application Details */}
      <div className="p-5 sm:w-2/3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Application for</p>
            <h3 className="text-2xl font-bold text-gray-800 hover:text-amber-600">
              <Link to={`/pet/${pet._id}`}>{pet.name}</Link>
            </h3>
          </div>
          <StatusBadge status={application.status} />
        </div>
        
        <p className="text-sm text-gray-600 mt-2">{pet.breed}</p>
        
        <div className="border-t border-gray-200 mt-4 pt-4">
          <p className="text-sm text-gray-500">
            Submitted on: {new Date(application.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Rehomer: <span className="font-medium text-gray-700">RehomerOne</span>
            {/* add the rehomer's name in a later step */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function MyApplications() {
  const { getToken } = useAuth();
  const { showNotification } = useNotification();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const res = await fetch('http://localhost:5001/api/applications/my-applications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch applications');
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        showNotification(err.message, 'error');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [getToken, showNotification]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoaderCircle className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">My Applications</h1>
      
      {applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map(app => (
            <ApplicationCard key={app._id} application={app} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <FileText size={48} className="mx-auto text-gray-400" />
          <h3 className="text-2xl font-semibold text-gray-700 mt-4">No Applications Found</h3>
          <p className="text-gray-500 mt-2">You haven't applied to adopt any pets yet.</p>
          <Link 
            to="/petlistings"
            className="inline-flex items-center gap-2 mt-6 bg-amber-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-amber-600 transition-colors"
          >
            Find a Friend
          </Link>
        </div>
      )}
    </div>
  );
}