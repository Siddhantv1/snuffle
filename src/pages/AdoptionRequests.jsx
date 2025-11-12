import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNotification } from '../hooks/useNotification';
import { Link } from 'react-router-dom';
import { LoaderCircle, FileText, Clock, CheckCircle, XCircle, X, User, Home, Smartphone, MapPin, Bed, Smile, PawPrint, ShieldCheck, Users } from 'lucide-react';


// This modal shows the full application details
const ApplicationDetailModal = ({ application, onClose, onUpdateStatus }) => {
  if (!application) return null;

  const { pet } = application;

  const handleUpdate = (status) => {
    // Ask for confirmation before updating
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this application?`)) {
      return;
    }
    onUpdateStatus(application._id, status);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Application Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Pet Info */}
          <div className="flex items-center gap-4">
            <img 
              src={pet?.image || 'https://www.placehold.co/600x600.png?text=No+Image'} 
              alt={pet?.name || 'Deleted Pet'} 
              className="w-24 h-24 object-cover rounded-lg bg-gray-100" 
            />
            <div>
              <p className="text-sm text-gray-500">Application for</p>
              <h3 className="text-2xl font-bold text-amber-600">{pet.name}</h3>
            </div>
            <StatusBadge status={application.status} />
          </div>

          {/* Applicant Info */}
          <Section title="Applicant Information">
            <InfoItem icon={<User />} label="Full Name" value={application.fullName} />
            <InfoItem icon={<Smartphone />} label="Contact Number" value={application.contactNumber} />
            <InfoItem icon={<Users />} label="Age" value={`${application.age} years old`} />
          </Section>
          
          {/* Residence Info */}
          <Section title="Residence Information">
            <InfoItem icon={<MapPin />} label="Address" value={application.address} />
            <InfoItem icon={<Home />} label="Residence Type" value={application.residenceType} />
            <InfoItem icon={<ShieldCheck />} label="ID Proof" value={
              <a href={application.idProofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                View Document
              </a>
            } />
          </Section>
          
          {/* Household Info */}
          <Section title="Household Environment">
            <InfoItem icon={<Users />} label="People in Household" value={application.householdSize} />
            <InfoItem icon={<PawPrint />} label="Has Other Pets?" value={application.hasOtherPets ? 'Yes' : 'No'} />
            <InfoItem icon={<Smile />} label="Has Kids?" value={application.hasKids ? 'Yes' : 'No'} />
            <InfoItem icon={<Bed />} label="Pet Will Sleep" value={application.petSleepLocation} />
          </Section>
        </div>

        {/* Action Buttons */}
        {application.status === 'Pending' && (
          <div className="p-6 sticky bottom-0 bg-gray-50 border-t border-gray-200 flex gap-4">
            <button
              onClick={() => handleUpdate('Approved')}
              disabled={!pet} // <-- Disable if pet is null
              className="flex-1 inline-flex justify-center items-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={20} /> Approve
            </button>
            <button
              onClick={() => handleUpdate('Rejected')}
              disabled={!pet} // <-- Disable if pet is null
              className="flex-1 inline-flex justify-center items-center gap-2 bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle size={20} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const Section = ({ title, children }) => (
  <div className="border-b border-gray-200 pb-4">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex gap-3">
    <div className="flex-shrink-0 text-gray-400 mt-1">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  let bgColor, textColor, Icon;
  switch (status) {
    case 'Approved':
      [bgColor, textColor, Icon] = ['bg-green-100', 'text-green-700', CheckCircle];
      break;
    case 'Rejected':
      [bgColor, textColor, Icon] = ['bg-red-100', 'text-red-700', XCircle];
      break;
    default:
      [bgColor, textColor, Icon] = ['bg-amber-100', 'text-amber-700', Clock];
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
      <Icon size={16} />
      {status}
    </span>
  );
};


// --- MAIN PAGE COMPONENT ---
export default function AdoptionRequests() {
  const { getToken } = useAuth();
  const { showNotification } = useNotification();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null); // For the modal

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const res = await fetch('http://localhost:5001/api/applications/received', {
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

  const handleUpdateStatus = async (appId, status) => {
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5001/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!res.ok) throw new Error('Failed to update status');

      const updatedApp = await res.json();
      
      // Update the status in our local list
      setApplications(prevApps => 
        prevApps.map(app => (app._id === updatedApp._id ? updatedApp : app))
      );
      
      setSelectedApp(updatedApp); // Refresh the modal with new data
      showNotification(`Application ${status.toLowerCase()} successfully!`, 'success');

    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoaderCircle className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Adoption Requests</h1>
        
        {applications.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map(app => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                    {/* Check if pet exists or not */}
                    {app.pet ? (
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full object-cover" src={app.pet.image} alt={app.pet.name} />
                        <div className="ml-4 font-medium text-gray-900">{app.pet.name}</div>
                      </div>
                      ):(
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <X size={20} className="text-gray-500" />
                          </div>
                          <div className="ml-4 font-medium text-gray-500 italic">Pet Deleted</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{app.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => setSelectedApp(app)}
                        className="text-amber-600 hover:text-amber-900 font-medium cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <FileText size={48} className="mx-auto text-gray-400" />
            <h3 className="text-2xl font-semibold text-gray-700 mt-4">No Adoption Requests</h3>
            <p className="text-gray-500 mt-2">You have not received any applications yet.</p>
          </div>
        )}
      </div>

      <ApplicationDetailModal 
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </>
  );
}