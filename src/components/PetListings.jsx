import React, { useState, useMemo } from 'react';
import { PawPrint, Search, XCircle, Dog, Cat, Bird, Rabbit, Plus } from 'lucide-react';
// import allPets from '../data/petsdata.js'; // <--
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react'; // import the useUser for user roles

// --- SUB-COMPONENTS ---

// A single pet card component
const PetCard = ({ pet }) => (
  //modify to use _id
  <Link to={`/pet/${pet._id}`}>
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out h-full flex flex-col">
    <img className="w-full h-48 object-cover" src={pet.image || 'https://www.placehold.co/600x600.png?text=No+Image+Available'} alt={pet.name} />
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{pet.breed}</p>
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>{pet.age} years old</span>
        <span>{pet.gender}</span>
      </div>
      <p className="text-gray-700 text-sm mb-4 h-10 overflow-hidden text-ellipsis">{pet.description}</p>
      <button className="cursor-pointer w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors duration-300 mt-auto">
        Adopt Me
      </button>
    </div>
  </div>
  </Link>
);

// Filtering controls component
const Filters = ({ filters, setFilters, onClear, allPets }) => { // <-- Add allPets prop
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const petTypes = [...new Set(allPets.map(p => p.type))]; // Use allPets prop
  const breeds = [...new Set(allPets.filter(p => !filters.type || p.type === filters.type).map(p => p.breed))]; // Use allPets prop

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pet Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Pet Type</label>
          <select id="type" name="type" value={filters.type} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="">All Types</option>
            {petTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        {/* Breed Filter */}
        <div>
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
          <select id="breed" name="breed" value={filters.breed} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500" disabled={!filters.type}>
            <option value="">All Breeds</option>
            {breeds.map(breed => <option key={breed} value={breed}>{breed}</option>)}
          </select>
        </div>
        {/* Age Filter */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Max Age (years)</label>
          <input type="range" id="age" name="age" min="0" max="15" value={filters.age} onChange={handleInputChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500" />
          <div className="text-center text-sm text-gray-600 mt-1">{filters.age === "15" ? "15+" : filters.age} years</div>
        </div>
        {/* Location Filter */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input type="text" id="location" name="location" value={filters.location} onChange={handleInputChange} placeholder="e.g., San Francisco" className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={onClear} className="cursor-pointer flex items-center text-gray-600 hover:text-amber-600 transition-colors">
          <XCircle size={18} className="cursor-pointer mr-1" />
          Clear Filters
        </button>
      </div>
    </div>
  );
};

// // Header component
const Header = () => (
  <header className="text-center my-8 md:my-12">
    <div className="flex justify-center items-center gap-3">
      {/* <PawPrint className="text-amber-500 h-10 w-10 sm:h-12 sm:w-12" /> */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">Available Pets</h1>
    </div>
    <p className="text-lg text-gray-500 mt-2">Find your new best friend.</p>
  </header>
);

// Main Component
function PetListings({ pets, onShowModal }) { // <-- Rename App to PetListings, accept props
  const { user } = useUser();
  const initialFilters = { type: '', breed: '', age: '15', location: '' };
  const [filters, setFilters] = useState(initialFilters);

  const isRehomer = user?.unsafeMetadata?.role === 'rehomer';

  const filteredPets = useMemo(() => {
    return pets.filter(pet => { // <-- Use 'pets' prop
      const typeMatch = !filters.type || pet.type === filters.type;
      const breedMatch = !filters.breed || pet.breed === filters.breed;
      const ageMatch = filters.age === '15' || pet.age <= parseInt(filters.age, 10);
      const locationMatch = !filters.location || pet.location.toLowerCase().includes(filters.location.toLowerCase());
      return typeMatch && breedMatch && ageMatch && locationMatch;
    });
  }, [filters, pets]); // <-- Add 'pets' to dependency array

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };
  
  // This is a side-effect to clear breed when type changes
  React.useEffect(() => {
    setFilters(prev => ({ ...prev, breed: '' }));
  }, [filters.type]);


  return (
    <div className="bg-amber-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        <Header />

        {isRehomer && (
        <div className="mb-6 flex justify-end">
            <button 
                onClick={onShowModal}
                className="inline-flex items-center gap-2 bg-green-600 cursor-pointer text-white font-bold py-3 px-6 rounded-lg hover:bg-green-500 transition-colors duration-300 shadow-md"
            >
                <Plus size={20} />
                Add New Pet
            </button>
        </div>
        )}

        <Filters 
            filters={filters} 
            setFilters={setFilters} 
            onClear={handleClearFilters}
            allPets={pets} // <-- Pass 'pets' prop to Filters
        />
        
        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* 2. Use pet._id for the key */}
            {filteredPets.map(pet => <PetCard key={pet._id} pet={pet} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700">No pets found!</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters to find more furry friends.</p>
            <button 
              onClick={handleClearFilters} 
              className="mt-6 bg-amber-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-600 transition-colors duration-300"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PetListings; // <-- Export PetListings