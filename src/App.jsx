import { useEffect, useState } from 'react';
import './index.css';
import { Heart, ClipboardList, Users, Search, ArrowRight, ScanSearch } from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';

// 2. Import Clerk components
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignIn,
  SignUp,
  useAuth, // <-- 1. Import useAuth to check login status
  useUser // for rehomer's Listing Pages
} from "@clerk/clerk-react";

import PetListings from './components/PetListings';
import PetDetails from './components/PetDetails';
import AddPetModal from './components/AddPetModal'; // Import the modal
// import initialPets from './data/petsdata'; // <-- 2. We no longer need this
import ProtectedRoute from './components/ProtectedRoute';
import Onboarding from './pages/Onboarding'; // for first time users
import AdoptionForm from './pages/AdoptionForm'; // for Adoption form filling
//import PetScanner from './pages/PetScanner'; // for ML model (Later addition)
import MyListings from './pages/MyListings'; // for My Listings Page
import EditPet from './pages/EditPet'; //for editing the pet details
import MyApplications from './pages/MyApplications'; // for viewing user's sent adoption requests
import AdoptionRequests from './pages/AdoptionRequests'; // to approve/decline incoming requests

function Home({ pets }) {
  return (
    <main>
      {/* --- Hero Section --- */}
      <section className="min-h-screen flex items-center pt-24 pb-12">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div className="text-center md:text-left">
            <img 
                src="../paws.png" 
                alt="Logo"
                className="w-75 h-auto"
              />
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Find Your New<br />
                <span className="text-amber-500">Best Friend</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto md:mx-0">
                Discover loving pets from shelters near you. Join us in making adoption the first choice and find a companion who's waiting for a forever home.
              </p>
              <Link // Changed from <a> to <Link>
                to="/petlistings" 
                className="inline-flex items-center gap-2 bg-amber-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-amber-600 transition-colors duration-300 shadow-lg"
              >
                <Search className="h-5 w-5" />
                Browse Pets
              </Link>
            </div>
            
            {/* Hero Image */}
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9yZGVyJTIwY29sbGllfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000" 
                alt="Happy adopted dog"
                className="rounded-3xl shadow-2xl w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* --- Why Adopt? Section --- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Snuffle?</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">We make the adoption process simple, joyful, and supportive.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-amber-50 rounded-2xl p-8 shadow-md">
                <div className="inline-block bg-amber-100 text-amber-600 rounded-full p-4 mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Give a Second Chance</h3>
                <p className="text-gray-600">Give a second chance to animals in need and help reduce pet overpopulation.</p>
              </div>
              {/* Card 2 */}
              <div className="bg-amber-50 rounded-2xl p-8 shadow-md">
                <div className="inline-block bg-amber-100 text-amber-600 rounded-full p-4 mb-4">
                  <ClipboardList className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Simple Process</h3>
                <p className="text-gray-600">Simple, transparent steps to bring home your companion. We guide you through every stage.</p>
              </div>
              {/* Card 3 */}
              <div className="bg-amber-50 rounded-2xl p-8 shadow-md">
                <div className="inline-block bg-amber-100 text-amber-600 rounded-full p-4 mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Join Our Community</h3>
                <p className="text-gray-600">Help us care for animals, get support, and make a difference in your community.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Featured Pets Section --- */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-12">Meet Some Friends</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {pets.slice(0, 4).map((pet) => ( // Use 'pets' prop
                <Link to={`/pet/${pet._id}`} // <-- 3. Use _id
                  key={pet._id} // <-- 3. Use _id
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 block"
                >
                  <img 
                    src={pet.image} 
                    alt={pet.name} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{pet.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {pet.age}-year-old {pet.breed}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            {/* See All Button */}
            <Link // Changed from <a> to <Link>
              to="/petlistings"
              className="inline-flex items-center gap-2 mt-12 bg-white text-amber-600 font-bold py-3 px-6 rounded-full text-lg border-2 border-amber-500 shadow-sm hover:bg-amber-500 hover:text-white transition-colors duration-300"
            >
              See All Pets
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
  );
}


function App() {
  const [isFloating, setIsFloating] = useState(false);
  const [pets, setPets] = useState([]); // <-- 4. Start with an empty array
  const [showModal, setShowModal] = useState(false);
  const { isSignedIn } = useAuth(); // Get auth status
  const { user } = useUser();
  const isRehomer = user?.unsafeMetadata?.role === 'rehomer';
  const isCustomer = user?.unsafeMetadata?.role === 'customer';
 
  // useEffect TO FETCH PETS
  useEffect(() => {
    // This function will run once when the app loads,
    // regardless of login status.
    const fetchPets = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/pets');
        const data = await res.json();
        setPets(data);
      } catch (error) {
        console.error('Failed to fetch pets:', error);
      }
    };
    
    fetchPets();
    
  }, []); // <-- An empty dependency array means this runs only ONCE.


  useEffect(() => {
    const handleScroll = () => setIsFloating(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 6. UPDATE handleAddPet
  // This function now adds the pet *from the database* to the top of the list
  const handleAddPet = (newPetFromDB) => {
    setPets(prevPets => [
      newPetFromDB, // Add the new pet to the beginning of the array
      ...prevPets
    ]);
    setShowModal(false); // Close modal on success
  };

  return (
    <>
      <div className="bg-amber-50 min-h-screen font-sans">
        {/* --- HEADER / NAVBAR --- */}
        <header
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
            isFloating
              ? 'bg-white/90 backdrop-blur-sm shadow-lg rounded-full max-w-screen-md'
              : 'bg-transparent shadow-none w-full max-w-screen-lg'
          }`}
        >
          <nav className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                <p className="text-amber-500 h-7 w-7">🐾</p>
                <span className={isFloating ? 'text-xl' : 'text-2xl'}>Snuffle</span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-8 px-8">
                <Link to="/" className="text-gray-700 hover:text-amber-600 transition-colors">Home</Link>
                <Link to="/petlistings" className="text-gray-700 hover:text-amber-600 transition-colors">Pet Listings</Link>
                
                {/* Extra Link for Role Specific */}
                <SignedIn>
                  {isRehomer && (
                    <>
                    <Link to="/my-listings" className="text-gray-700 hover:text-amber-600 transition-colors">My Listings</Link>
                    <Link to="/adoption-requests" className="text-gray-700 hover:text-amber-600 transition-colors">Adoption Requests</Link>
                    </>
                  )}
                  {isCustomer && (
                    <Link to="/my-applications" className="text-gray-700 hover:text-amber-600 transition-colors">My Applications</Link>
                  )}
                </SignedIn>
                {/* For ML model (Later addition) */}
                {/* <Link to="/pet-scanner" className="flex items-center gap-1 text-gray-700 hover:text-amber-600 transition-colors">
                  <ScanSearch size={16} />
                  Scanner
                </Link> */}

                <Link to="/contact" className="text-gray-700 hover:text-amber-600 transition-colors">Contact us</Link>
              </div>

              {/* Clerk Sign In / User Button */}
              <div className={`transition-all duration-300 ${isFloating ? 'scale-90' : 'scale-100'}`}>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className={`text-white bg-amber-500 hover:bg-amber-600 cursor-pointer font-medium rounded-full text-sm transition-all duration-300 ${
                  isFloating ? 'px-5 py-2' : 'px-6 py-3'
                }`}>
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
              
            </div>
          </nav>
        </header>

        {/* --- MAIN ROUTING AREA --- */}
        <div className="pt-32">
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Home pets={pets} />} /> 
            
            {/* Protected Routes */}

            {/* route for onboarding first time users */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            {/* Pet Listings Route */}
            <Route 
              path="/petlistings" 
              element={
                <ProtectedRoute>
                  <PetListings pets={pets} onShowModal={() => setShowModal(true)} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pet/:id" 
              element={
                <ProtectedRoute>
                  <PetDetails pets={pets} />
                </ProtectedRoute>
              } 
            />
            {/* Apply for Adoption Route */}
            <Route 
              path="/pet/:id/apply" 
              element={
                <ProtectedRoute>
                  <AdoptionForm pets={pets} />
                </ProtectedRoute>
              } 
            />

            {/* For viewing My Listings */}
            <Route 
              path="/my-listings" 
              element={
                <ProtectedRoute>
                  <MyListings />
                </ProtectedRoute>
              } 
            />
            {/* Route for viewing Adoption Applications */}
            <Route 
              path="/my-applications" 
              element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              } 
            />

            {/* For editing pet details  */}
            <Route 
              path="/pet/:id/edit" 
              element={
                <ProtectedRoute>
                  <EditPet />
                </ProtectedRoute>
              } 
            />

            {/* FOr viewing Incoming Adoption Requests */}
            <Route 
              path="/adoption-requests" 
              element={
                <ProtectedRoute>
                  <AdoptionRequests />
                </ProtectedRoute>
              } 
            />

            
            {/* For ML model (Later addition) prediction */}
            {/* <Route 
              path="/pet-scanner" 
              element={
                <ProtectedRoute>
                  <PetScanner />
                </ProtectedRoute>
              } 
            /> */}
             
            {/* Clerk Auth Routes */}
            <Route 
              path="/signin" 
              element={<SignIn routing="path" path="/signin" />} 
            />
            <Route 
              path="/signup" 
              element={<SignUp routing="path" path="/signup" />} 
            />
          </Routes>
        </div>

        {/* --- FOOTER --- */}
        {/* ... (Footer remains the same) ... */}
        <footer className="bg-gray-800 text-gray-300 py-12 mt-24">
          <div className="container mx-auto px-6 text-center">
            <Link to="/" className="flex justify-center items-center gap-2 text-2xl font-bold text-white mb-4">
              <p className="text-amber-500 h-7 w-7">🐾</p>
              Snuffle
            </Link>
            <p className="mb-4">Helping you find your new best friend.</p>
            <div className="flex justify-center space-x-6 mb-6">
              <a href="#" className="hover:text-white">Facebook</a>
              <a href="#" className="hover:text-white">Instagram</a>
              <a href="#" className="hover:text-white">Twitter</a>
            </div>
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Snuffle. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* --- ADD PET MODAL --- */}
      <AddPetModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onAddPet={handleAddPet} 
      />
    </>
  );
}

export default App;