import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNotification } from '../hooks/useNotification';
import { Link } from 'react-router-dom';
import { LoaderCircle, Trash2, Edit, Plus, Home } from 'lucide-react';

// This is a special card just for this page
function MyPetCard({ pet, onDeleteClick }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 duration-150">
      <Link to={`/pet/${pet._id}`}>
        <img className="w-full h-48 object-cover" src={pet.image || 'https://www.placehold.co/300x300.png?text=No+Image+Available'} alt={pet.name} />
      </Link>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{pet.breed}</p>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>{pet.age} years old</span>
          <span>{pet.gender}</span>
        </div>
        {/* Buttons */}
        <div className="flex gap-2">
          <Link 
            to = {`/pet/${pet._id}/edit`}
            className="flex-1 inline-flex justify-center items-center gap-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <Edit size={16} /> Edit
          </Link>
          <button 
            onClick={() => onDeleteClick(pet._id, pet.name)}
            className="flex-1 inline-flex justify-center items-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyListings() {
  const { getToken } = useAuth();
  const { showNotification } = useNotification();
  const [myPets, setMyPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyPets = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const res = await fetch('http://localhost:5001/api/pets/my-listings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setMyPets(data);
      } catch (err) {
        showNotification('Failed to fetch your listings.', 'error');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyPets();
  }, [getToken, showNotification]);

  const handleDeleteClick = (petId, petName) => {
    // Confirm before deleting
    if (!window.confirm(`Are you sure you want to delete ${petName}? This cannot be undone.`)) {
      return;
    }

    const deletePet = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:5001/api/pets/${petId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Failed to delete');
        
        // Remove the pet from the list instantly
        setMyPets(prevPets => prevPets.filter(p => p._id !== petId));
        showNotification(`${petName}'s Listing was deleted successfully.`, 'success');

      } catch (err) {
        showNotification('Failed to delete listing. Please try again.', 'error');
        console.error(err);
      }
    };
    
    deletePet();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoaderCircle className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">My Listings</h1>
        <Link 
          to="/petlistings" // This just goes to the main page where the AddPetModal lives
          className="inline-flex items-center gap-2 bg-green-600 cursor-pointer text-white font-bold py-3 px-6 rounded-lg hover:bg-green-500 transition-colors duration-300 shadow-md"
        >
          <Plus size={20} />
          Add New Pet
        </Link>
      </div>

      {myPets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myPets.map(pet => (
            <MyPetCard key={pet._id} pet={pet} onDeleteClick={handleDeleteClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <Home size={48} className="mx-auto text-gray-400" />
          <h3 className="text-2xl font-semibold text-gray-700 mt-4">No Listings Found</h3>
          <p className="text-gray-500 mt-2">You haven't listed any pets yet. Click "Add New Pet" to get started.</p>
        </div>
      )}
    </div>
  );
}