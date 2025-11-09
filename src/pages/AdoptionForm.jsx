import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { LoaderCircle, UploadCloud, FileText, ArrowLeft } from 'lucide-react';

export default function AdoptionForm({ pets }) {
  const { id: petId } = useParams();
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  const pet = pets.find(p => p._id === petId);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    age: '',
    householdSize: '',
    contactNumber: user?.phoneNumbers[0]?.phoneNumber || '',
    address: '',
    residenceType: '',
    idProof: null,
    hasOtherPets: '',
    hasKids: '',
    petSleepLocation: '',
    agreedToCare: false,
    agreedToBackgroundCheck: false,
  });
  const [idProofPreview, setIdProofPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, idProof: file }));
      setIdProofPreview(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreedToCare || !formData.agreedToBackgroundCheck) {
      alert('You must agree to both terms to proceed.');
      return;
    }
    if (!formData.idProof) {
      alert('Please upload your ID proof.');
      return;
    }
    
    setIsSubmitting(true);
    const data = new FormData();
    // Append all form data
    data.append('petId', pet._id);
    data.append('rehomerId', pet.rehomerId);
    data.append('fullName', formData.fullName);
    data.append('age', formData.age);
    data.append('householdSize', formData.householdSize);
    data.append('contactNumber', formData.contactNumber);
    data.append('address', formData.address);
    data.append('residenceType', formData.residenceType);
    data.append('idProof', formData.idProof);
    data.append('hasOtherPets', formData.hasOtherPets === 'Yes');
    data.append('hasKids', formData.hasKids === 'Yes');
    data.append('petSleepLocation', formData.petSleepLocation);
    data.append('agreedToCare', formData.agreedToCare);
    data.append('agreedToBackgroundCheck', formData.agreedToBackgroundCheck);

    try {
      const token = await getToken();
      const res = await fetch('http://localhost:5001/api/applications', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data,
      });

      if (!res.ok) {
        throw new Error('Failed to submit application');
      }

      await res.json();
      alert('Your application has been submitted successfully!');
      navigate(`/pet/${pet._id}`); // Go back to the pet's detail page
    } catch (err) {
      console.error(err);
      alert('Error submitting application. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!pet) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl text-gray-700">Pet not found</h2>
        <Link to="/petlistings" className="cursor-pointer mt-4 bg-amber-500 text-white px-4 py-2 rounded-lg">
          Back to listings
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          to={`/pet/${pet._id}`}
          className="cursor-pointer inline-flex items-center gap-2 text-amber-600 font-bold mb-6 group"
        >
          <ArrowLeft size={20} className="cursor-pointer transition-transform group-hover:-translate-x-1" />
          Back to {pet.name}'s Profile
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Adoption Application</h1>
            <p className="text-lg text-gray-600 mb-6">
              You are applying to adopt <span className="font-bold text-amber-600">{pet.name}</span>.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Personal Info */}
              <Section title="Your Information">
                <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Your Age" name="age" type="number" min="18" value={formData.age} onChange={handleChange} placeholder="Enter Age" required />
                  <Input label="No. of people in household" name="householdSize" type="number" min="1" value={formData.householdSize} onChange={handleChange} placeholder="" required />
                </div>
              </Section>

              {/* Section 2: Contact & Residence */}
              <Section title="Contact & Residence">
                <Input label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Phone number" required />
                <Input label="Full Address" name="address" value={formData.address} onChange={handleChange} placeholder="Your Complete Address" required />
                <Select label="Type of Residence" name="residenceType" value={formData.residenceType} onChange={handleChange} options={['Hostel', 'House', 'Flat']} required />
                <FileUpload label="Valid ID for Proof of Residence" name="idProof" onChange={handleFileChange} previewText={idProofPreview} required />
              </Section>
              
              {/* Section 3: Household Environment */}
              <Section title="Household Environment">
                <RadioGroup label="Do you currently own other pets?" name="hasOtherPets" value={formData.hasOtherPets} onChange={handleChange} options={['Yes', 'No']} />
                <RadioGroup label="Do kids live in your household?" name="hasKids" value={formData.hasKids} onChange={handleChange} options={['Yes', 'No']} />
                <Select label="Where will the pet sleep?" name="petSleepLocation" value={formData.petSleepLocation} onChange={handleChange} options={['Indoors', 'Outdoors']} required />
              </Section>

              {/* Section 4: Agreements */}
              <Section title="Agreements">
                <Checkbox name="agreedToCare" checked={formData.agreedToCare} onChange={handleChange} label="I agree to provide medical care, food, shelter, and love to this pet." />
                <Checkbox name="agreedToBackgroundCheck" checked={formData.agreedToBackgroundCheck} onChange={handleChange} label="I agree to a background check." />
              </Section>
              
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-3 bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-green-700 transition-colors duration-300 shadow-lg disabled:bg-green-300 cursor-pointer"
                >
                  {isSubmitting ? <LoaderCircle className="animate-spin" size={24} /> : 'Send Adoption Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Form Components ---

const Section = ({ title, children }) => (
  <div className="border-b border-gray-200 pb-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      id={props.name}
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
    />
  </div>
);

const Select = ({ label, name, options, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      id={name}
      name={name}
      {...props}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer `}
    >
      <option value="" disabled>- Select -</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const RadioGroup = ({ label, name, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex gap-4 mt-2">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={onChange}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500"
          />
          <span className="text-gray-700">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const FileUpload = ({ label, name, onChange, previewText, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <label
      htmlFor={name}
      className="relative flex flex-col items-center justify-center w-full h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors"
    >
      {previewText ? (
        <div className="text-center text-green-600">
          <FileText className="mx-auto h-10 w-10" />
          <span className="mt-2 block text-sm font-medium">{previewText}</span>
          <span className="text-xs">Click to change file</span>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <UploadCloud className="mx-auto h-10 w-10" />
          <span className="mt-2 block text-sm font-medium">Click to upload ID</span>
          <span className="text-xs">PDF, PNG, or JPG</span>
        </div>
      )}
    </label>
    <input
      id={name}
      name={name}
      type="file"
      accept="image/*,.pdf"
      onChange={onChange}
      required={required}
      className="sr-only"
    />
  </div>
);

const Checkbox = ({ name, checked, onChange, label }) => (
  <label className="flex items-start gap-3 cursor-pointer">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded mt-0.5"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);