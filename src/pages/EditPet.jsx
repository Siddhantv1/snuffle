import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNotification } from '../hooks/useNotification';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { LoaderCircle, UploadCloud, ArrowLeft } from 'lucide-react';

export default function EditPet() {
  const { id: petId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState(null); // Start as null
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch existing pet data on load
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:5001/api/pets/${petId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch pet data');
        const data = await res.json();
        
        setFormData({
          name: data.name,
          type: data.type,
          breed: data.breed,
          age: data.age,
          gender: data.gender,
          size: data.size || '',
          location: data.location || '',
          description: data.description || '',
          image: null, // We use 'image' for new uploads
        });
        setPreview(data.image); // Set the existing image as the preview
        
      } catch (err) {
        showNotification(err.message, 'error');
        navigate('/my-listings'); // Go back if we can't load it
      }
    };
    fetchPetData();
  }, [petId, getToken, showNotification, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file })); // Store the new file
      setPreview(URL.createObjectURL(file)); // Show new preview
    }
  };

  // 2. Handle the PATCH request on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = await getToken();
      const data = new FormData();
      
      // Append all fields
      data.append('name', formData.name);
      data.append('type', formData.type);
      data.append('breed', formData.breed);
      data.append('age', formData.age);
      data.append('gender', formData.gender);
      data.append('size', formData.size);
      data.append('location', formData.location);
      data.append('description', formData.description);
      
      // Only append the image if a *new* one was selected
      if (formData.image) {
        data.append('image', formData.image);
      }

      const res = await fetch(`http://localhost:5001/api/pets/${petId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data,
      });

      if (!res.ok) throw new Error('Failed to update pet');

      showNotification('Pet updated successfully!', 'success');
      navigate('/my-listings'); // Go back to the listings page

    } catch (err) {
      showNotification(err.message, 'error');
      setIsSubmitting(false);
    }
  };

  // Show a loader while the form data is loading
  if (!formData) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoaderCircle className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          to="/my-listings"
          className="cursor-pointer inline-flex items-center gap-2 text-amber-600 font-bold mb-6 group"
        >
          <ArrowLeft size={20} className="cursor-pointer transition-transform group-hover:-translate-x-1" />
          Back to My Listings
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            Edit {formData.name}
          </h1>
          {/* This form is identical to AddPetModal's form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" label="Name" value={formData.name} onChange={handleChange} required />
              <Select name="type" label="Type" value={formData.type} onChange={handleChange} options={['Dog', 'Cat', 'Bird', 'Rabbit']} required />
            </div>
            <Input name="breed" label="Breed" value={formData.breed} onChange={handleChange} required />
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet Picture</label>
              <label htmlFor="image" className="relative flex flex-col items-center justify-center w-1/2 h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50">
                {preview && (
                  <img src={preview} alt="Pet Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                )}
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white font-medium">Change Picture</span>
                </div>
              </label>
              <input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input name="age" label="Age" type="number" min="0" value={formData.age} onChange={handleChange} required />
              <Select name="gender" label="Gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female']} required />
              <Select name="size" label="Size (Optional)" value={formData.size} onChange={handleChange} options={['Small', 'Medium', 'Large']} />
            </div>
            <Input name="location" label="Location" value={formData.location} onChange={handleChange} />
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="description" name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => navigate('/my-listings')} className="bg-gray-100 text-gray-700 cursor-pointer font-medium py-2 px-5 rounded-lg hover:bg-gray-200">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="bg-amber-500 text-white cursor-pointer font-medium py-2 px-5 rounded-lg hover:bg-amber-600 disabled:bg-amber-300">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- Helper Form Components (Copied from AddPetModal) ---
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
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer ${
        !props.value ? 'text-gray-400' : 'text-gray-800'
      }`}
    >
      <option value="" disabled>- Select -</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);