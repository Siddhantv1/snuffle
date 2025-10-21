import React, { useState, useMemo } from 'react';
import { PawPrint, Search, XCircle, Dog, Cat, Bird, Rabbit } from 'lucide-react';

// --- MOCK DATA ---
const allPets = [
  { id: 1, name: 'Buddy', type: 'Dog', breed: 'Golden Retriever', age: 2, gender: 'Male', size: 'Large', location: 'Sunnyvale, CA', image: 'https://placehold.co/300x300/f8b400/ffffff?text=Buddy', description: 'Friendly and energetic, loves to play fetch.' },
  { id: 2, name: 'Lucy', type: 'Dog', breed: 'Labrador Retriever', age: 3, gender: 'Female', size: 'Large', location: 'Austin, TX', image: 'https://placehold.co/300x300/d97706/ffffff?text=Lucy', description: 'Sweet-natured and great with kids.' },
  { id: 3, name: 'Whiskers', type: 'Cat', breed: 'Siamese', age: 1, gender: 'Male', size: 'Small', location: 'New York, NY', image: 'https://placehold.co/300x300/a3e635/ffffff?text=Whiskers', description: 'A curious and vocal companion.' },
  { id: 4, name: 'Mochi', type: 'Cat', breed: 'Domestic Shorthair', age: 5, gender: 'Female', size: 'Medium', location: 'Seattle, WA', image: 'https://placehold.co/300x300/84cc16/ffffff?text=Mochi', description: 'Loves napping in sunbeams and gentle pets.' },
  { id: 5, name: 'Kiwi', type: 'Bird', breed: 'Parakeet', age: 1, gender: 'Male', size: 'Small', location: 'Miami, FL', image: 'https://placehold.co/300x300/22c55e/ffffff?text=Kiwi', description: 'A cheerful bird who loves to sing.' },
  { id: 6, name: 'Thumper', type: 'Rabbit', breed: 'Holland Lop', age: 2, gender: 'Male', size: 'Small', location: 'Denver, CO', image: 'https://placehold.co/300x300/10b981/ffffff?text=Thumper', description: 'Loves carrots and hopping around.' },
  { id: 7, name: 'Rocky', type: 'Dog', breed: 'German Shepherd', age: 4, gender: 'Male', size: 'Large', location: 'Chicago, IL', image: 'https://placehold.co/300x300/f59e0b/ffffff?text=Rocky', description: 'Loyal, intelligent, and protective.' },
  { id: 8, name: 'Cleo', type: 'Cat', breed: 'Maine Coon', age: 2, gender: 'Female', size: 'Large', location: 'Boston, MA', image: 'https://placehold.co/300x300/65a30d/ffffff?text=Cleo', description: 'A gentle giant with a fluffy coat.' },
  { id: 9, name: 'Zazu', type: 'Bird', breed: 'Cockatiel', age: 3, gender: 'Female', size: 'Small', location: 'Phoenix, AZ', image: 'https://placehold.co/300x300/16a34a/ffffff?text=Zazu', description: 'Can whistle tunes and enjoys head scratches.' },
  { id: 10, name: 'Bella', type: 'Dog', breed: 'Poodle', age: 1, gender: 'Female', size: 'Small', location: 'Los Angeles, CA', image: 'https://placehold.co/300x300/eab308/ffffff?text=Bella', description: 'Smart, hypoallergenic, and very cuddly.' },
  { id: 11, name: 'Oreo', type: 'Rabbit', breed: 'Dutch', age: 1, gender: 'Male', size: 'Medium', location: 'Portland, OR', image: 'https://placehold.co/300x300/059669/ffffff?text=Oreo', description: 'A curious rabbit with a playful spirit.' },
  { id: 12, name: 'Smokey', type: 'Cat', breed: 'Russian Blue', age: 6, gender: 'Male', size: 'Medium', location: 'San Francisco, CA', image: 'https://placehold.co/300x300/4d7c0f/ffffff?text=Smokey', description: 'A quiet and reserved cat who warms up.' },
];

// --- SUB-COMPONENTS ---

// A single pet card component
const PetCard = ({ pet }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <img className="w-full h-48 object-cover" src={pet.image} alt={pet.name} />
    <div className="p-4">
      <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{pet.breed}</p>
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>{pet.age} years old</span>
        <span>{pet.gender}</span>
      </div>
      <p className="text-gray-700 text-sm mb-4 h-10">{pet.description}</p>
      <button className="w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors duration-300">
        Adopt Me
      </button>
    </div>
  </div>
);

// Filtering controls component
const Filters = ({ filters, setFilters, onClear }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const petTypes = [...new Set(allPets.map(p => p.type))];
  const breeds = [...new Set(allPets.filter(p => !filters.type || p.type === filters.type).map(p => p.breed))];

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
        <button onClick={onClear} className="flex items-center text-gray-600 hover:text-amber-600 transition-colors">
          <XCircle size={18} className="mr-1" />
          Clear Filters
        </button>
      </div>
    </div>
  );
};

// Header component
const Header = () => (
  <header className="text-center my-8 md:my-12">
    <div className="flex justify-center items-center gap-3">
      <PawPrint className="text-amber-500 h-10 w-10 sm:h-12 sm:w-12" />
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">snuffle</h1>
    </div>
    <p className="text-lg text-gray-500 mt-2">Find your new best friend.</p>
  </header>
);

// Main App Component
export default function App() {
  const initialFilters = { type: '', breed: '', age: '15', location: '' };
  const [filters, setFilters] = useState(initialFilters);

  const filteredPets = useMemo(() => {
    return allPets.filter(pet => {
      const typeMatch = !filters.type || pet.type === filters.type;
      const breedMatch = !filters.breed || pet.breed === filters.breed;
      const ageMatch = filters.age === '15' || pet.age <= parseInt(filters.age, 10);
      const locationMatch = !filters.location || pet.location.toLowerCase().includes(filters.location.toLowerCase());
      return typeMatch && breedMatch && ageMatch && locationMatch;
    });
  }, [filters]);

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
        <Filters filters={filters} setFilters={setFilters} onClear={handleClearFilters} />
        
        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPets.map(pet => <PetCard key={pet.id} pet={pet} />)}
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