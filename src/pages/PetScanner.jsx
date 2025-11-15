// src/pages/PetScanner.jsx
import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNotification } from '../hooks/useNotification';
import { UploadCloud, LoaderCircle, PawPrint, AlertTriangle, Image } from 'lucide-react';

export default function PetScanner() {
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  
  const { getToken } = useAuth();
  const { showNotification } = useNotification();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setPrediction(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) return showNotification('Please upload an image first.', 'warning');

    setIsPredicting(true);
    setPrediction(null);
    setError(null);

    const data = new FormData();
    data.append('image', file);

    try {
      const token = await getToken();
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data,
      });

      if (!res.ok) throw new Error('Prediction failed. The model might be offline.');

      const result = await res.json();
      setPrediction(result.breed);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'Could not auto-detect breed.');
      showNotification('An error occurred during prediction.', 'error');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Animal Scanner
          </h1>
          <p className="text-lg text-gray-600 mb-6 text-center">
            Upload a picture of an animal to identify its breed!
          </p>

          {/* --- UPLOAD AREA --- */}
          <label
            htmlFor="pet-scan-upload"
            className="relative flex flex-col items-center justify-center w-full h-64 bg-amber-50 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-100 transition-colors overflow-hidden"
          >
            {preview ? (
              <>
              
              <img
                src={preview}
                alt="Pet Preview"
                className="absolute inset-0 w-full h-full object-cover rounded-lg z-0"
              />
              <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                <Image className="h-10 w-10 text-amber-50 mx-2" />
                <span className="text-white font-medium">Change Picture</span>
              </div>
              </>
            ) : (
              <div className="text-center text-gray-500 z-0">
                <UploadCloud className="mx-auto h-12 w-12 text-amber-500" />
                <span className="mt-2 block text-lg font-light">
                  Click to upload a picture
                </span>
                <span className="text-sm font-extralight">PNG or JPG</span>
              </div>
            )}
          </label>

          <input
            id="pet-scan-upload"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            disabled={isPredicting}
          />

          {/* --- ACTION BUTTONS --- */}
          {preview && (
            <div className="flex justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 cursor-pointer"
                disabled={isPredicting}
              >
                {isPredicting ? 'Processing...' : 'Submit Image'}
              </button>
            </div>
          )}

          {/* --- RESULT AREA --- */}
          <div className="mt-6 min-h-[100px] flex items-center justify-center">
            {isPredicting && (
              <div className="text-center text-gray-600">
                <LoaderCircle className="animate-spin h-10 w-10 mx-auto text-amber-500" />
                <p className="mt-2 text-lg font-medium">Identifying breed...</p>
              </div>
            )}
            
            {error && !isPredicting && (
              <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertTriangle className="h-10 w-10 mx-auto" />
                <p className="mt-2 text-lg font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            
            {prediction && !isPredicting && (
              <div className="text-center text-green-700 bg-green-50 p-6 rounded-lg">
                <PawPrint className="h-10 w-10 mx-auto" />
                <p className="mt-2 text-lg font-medium">We think this is a:</p>
                <p className="text-4xl font-bold text-green-800">{prediction}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
