import { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react'; // <-- 1. Import useAuth

export default function AddPetModal({ show, onClose, onAddPet }) {
  const { getToken } = useAuth(); // <-- 2. Get the getToken function
  const [formData, setFormData] = useState({
    name: '',
    type: '', 
    breed: '',
    age: '',
    gender: '', 
    size: '', 
    location: '',
    image: null,
    description: '',
  });

  const [preview, setPreview] = useState(null); // For image preview
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //1. change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // Keep the preview
      setFormData(prev => ({ ...prev, image: file })); // <-- Store the ACTUAL FILE
    }
  };

  // 3. Make handleSubmit async
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.breed || !formData.age || !formData.type || !formData.gender) {
      alert('Please fill out all required fields: Name, Type, Breed, Age, and Gender.');
      return;
    }
    //2. set image uploading necessary.
    if (!formData.image) {
      alert('Please upload a picture of the pet.');
      return;
    }

    setIsSubmitting(true); // Set loading state
    // We must use FormData to send a file
      const data = new FormData();
      data.append('name', formData.name);
      data.append('type', formData.type);
      data.append('breed', formData.breed);
      data.append('age', parseInt(formData.age, 10));
      data.append('gender', formData.gender);
      data.append('size', formData.size || '');
      data.append('location', formData.location);
      data.append('description', formData.description);
      data.append('image', formData.image); // <-- Append the file object

    try {
      const token = await getToken(); // 4. Get the user's auth token

      // 5. Send the data to your backend API
      const res = await fetch('http://localhost:5001/api/pets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // -- DO NOT set Content-Type: 'application/json' --
          // The browser automatically sets the correct 'multipart/form-data' header
        },
        body: data // <-- Send the FormData object
      });

      if (!res.ok) {
        throw new Error('Failed to save pet');
      }

      const savedPet = await res.json(); // 6. Get the saved pet from the API response
      
      onAddPet(savedPet); // 7. Pass the *new pet from the DB* to App.jsx

      // 8. Reset form and close
      setFormData({
        name: '', type: '', breed: '', age: '', gender: '',
        size: '', location: '', image: null, description: '',
      });
      setPreview(null);
      onClose();

    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false); // Unset loading state
    }
  };

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Add a New Pet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="name" label="Name" value={formData.name} onChange={handleChange} placeholder="Name of your pet" required />
            <Select name="type" label="Type" value={formData.type} onChange={handleChange} options={['Dog', 'Cat', 'Bird', 'Rabbit']} required />
          </div>

          <Input name="breed" label="Breed" value={formData.breed} onChange={handleChange} placeholder="Breed of your pet" required />

          {/* File Upload */}
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pet Picture
                </label>
                
                {/* This is the preview area.
                    It's a <label> so clicking it triggers the hidden file input.
                */}
                <label
                    htmlFor="image"
                    className="relative flex flex-col items-center justify-center w-1/2 h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors"
                >
                    {preview ? (
                    // --- PREVIEW STATE ---
                    // When a preview image exists
                    <>
                        <img
                        src={preview}
                        alt="Pet Preview"
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        />
                        {/* Dark overlay with text on hover */}
                        <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white font-medium">Change Picture</span>
                        </div>
                    </>
                    ) : (
                        
                    // When no image is selected
                    <div className="text-center text-gray-500">
                        <UploadCloud className="mx-auto h-10 w-10" />
                        <span className="mt-2 block text-sm font-medium">
                        Click to upload a picture
                        </span>
                        <span className="text-xs">PNG, JPG, GIF</span>
                    </div>
                    )}
                </label>

                {/* This is the actual file input.
                    The 'sr-only' class visually hides it while keeping it accessible.
                */}
                <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only" 
                />
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input name="age" label="Age" type="number" min="0" value={formData.age} onChange={handleChange} placeholder="Enter Age" required />
            <Select name="gender" label="Gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female']} required />
            <Select name="size" label="Size (Optional)" value={formData.size} onChange={handleChange} options={['Small', 'Medium', 'Large']} />
          </div>

          <Input name="location" label="Location" value={formData.location} onChange={handleChange} placeholder="Enter Location" />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Describe your pet.."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting} // Disable when submitting
              className="bg-gray-100 text-gray-700 cursor-pointer font-medium py-2 px-5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting} // Disable when submitting
              className="bg-amber-500 text-white cursor-pointer font-medium py-2 px-5 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper sub-components
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

// Updated Select component
const Select = ({ label, name, options, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      id={name}
      name={name}
      {...props}
      // This will make the text gray when the placeholder is selected
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
    >
      {/* new placeholder option */}
      <option value="" disabled>
        - Select -
      </option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);
