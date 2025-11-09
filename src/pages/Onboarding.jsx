import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle, MapPin, User, Home } from 'lucide-react';

export default function Onboarding() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [role, setRole] = useState(''); // 'customer' or 'rehomer'
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !location) {
      alert('Please select a role and enter your location.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save the data to Clerk's public metadata
      await user.update({
        unsafeMetadata: { //because unsafeMetadata has both frontend and backend R/W access
          role: role,
          location: location,
        },
      });
      // After saving, send them to the main pet listings page
      navigate('/petlistings');
    } catch (err) {
      console.error('Error updating user metadata', err);
      alert('Failed to save your information. Please try again.');
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
              Where are you located?
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
                placeholder="e.g., Sunnyvale, CA"
              />
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>

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