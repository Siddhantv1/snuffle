import React, { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle, MapPin, User, Home, UploadCloud, FileText } from 'lucide-react';
import { useNotification } from '../hooks/useNotification'

export default function Onboarding() {
  const { user } = useUser();
  const { getToken } = useAuth(); // Import getToken
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  // State for all fields
  const [role, setRole] = useState(''); // 'customer' or 'rehomer'
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState(''); // New state
  const [certificate, setCertificate] = useState(null); // New state for the file
  const [certPreview, setCertPreview] = useState(''); // New state for preview
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCertificateChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificate(file);
      setCertPreview(file.name); // Show the file name
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !location) {
      showNotification('Please select a role and enter your location.', 'error');
      return;
    }
    
    // Create a new FormData object to send file + text
    const data = new FormData();
    data.append('role', role);
    data.append('location', location);

    if (role === 'rehomer') {
      if (!address || !certificate) {
        showNotification('As a rehomer, you must provide your full address and a certificate.', 'error');
        return;
      }
      data.append('address', address);
      data.append('certificate', certificate); // Append the file
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      
      // POST to our new backend endpoint
      const res = await fetch('http://localhost:5001/api/onboarding', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // No Content-Type, FormData sets it automatically
        },
        body: data,
      });

      if (!res.ok) {
        throw new Error('Server failed to save data.');
      }

      await res.json();
      
      // Manually update the user session to get new metadata
      await user.reload(); 
      
      navigate('/petlistings');
      showNotification('Welcome to Snuffle!', 'success');
    } catch (err) {
      console.error('Error submitting onboarding', err);
      showNotification('Failed to save your information. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to Snuffle!</h1>
          <p className="text-gray-600 mt-2">Let's get your account set up.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What brings you here?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <RoleButton
                icon={<User size={24} />}
                label="I'm looking to adopt"
                role="customer"
                selectedRole={role}
                onClick={() => setRole('customer')}
              />
              <RoleButton
                icon={<Home size={24} />}
                label="I'm a rehomer"
                role="rehomer"
                selectedRole={role}
                onClick={() => setRole('rehomer')}
              />
            </div>
          </div>

          {/* Location Input */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Where are you located? (City, State)
            </label>
            <div className="relative">
              <input
                id="location"
                name="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., Mumbai, Maharashtra"
              />
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>

          {/* --- NEW CONDITIONAL FIELDS --- */}
          {role === 'rehomer' && (
            <div className="space-y-6 p-4 border border-amber-200 bg-amber-50 rounded-lg">
              {/* Full Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Shelter/Store Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter the address of your Shelter/Pet Store"
                ></textarea>
              </div>
              
              {/* Certificate Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Certificate
                </label>
                <label
                  htmlFor="certificate"
                  className="relative flex flex-col items-center justify-center w-full h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-100 transition-colors"
                >
                  {certPreview ? (
                    <div className="text-center text-green-600">
                      <FileText className="mx-auto h-10 w-10" />
                      <span className="mt-2 block text-sm font-medium">
                        {certPreview}
                      </span>
                      <span className="text-xs">Click to change file</span>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <UploadCloud className="mx-auto h-10 w-10" />
                      <span className="mt-2 block text-sm font-medium">
                        Click to upload
                      </span>
                      <span className="text-xs">PDF, PNG, or JPG</span>
                    </div>
                  )}
                </label>
                <input
                  id="certificate"
                  name="certificate"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleCertificateChange}
                  className="sr-only"
                />
                <p className='block text-amber-600 font-semibold text-sm'>We will verify the legitimacy of your certificate with the Animal Welfare Board.</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center bg-amber-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-amber-600 transition-colors duration-300 shadow-lg disabled:bg-amber-300 cursor-pointer"
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" size={24} />
              ) : (
                'Save & Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper component for the role buttons
const RoleButton = ({ icon, label, role, selectedRole, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg transition-all ${
      selectedRole === role
        ? 'border-amber-500 bg-amber-50'
        : 'border-gray-300 bg-white hover:border-gray-400'
    }`}
  >
    <div
      className={`mb-3 p-3 rounded-full ${
        selectedRole === role ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {icon}
    </div>
    <span
      className={`text-sm font-medium ${
        selectedRole === role ? 'text-amber-600' : 'text-gray-700'
      }`}
    >
      {label}
    </span>
  </button>
);