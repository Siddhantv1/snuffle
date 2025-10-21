import { useEffect, useState } from 'react';
import './App.css';
import { PawPrint, Heart, ClipboardList, Users, Search, ArrowRight } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import PetListings from './components/PetListings';

function App() {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger floating state after scrolling down a bit
      setIsFloating(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-amber-50 min-h-screen font-sans">
      {/* --- HEADER / NAVBAR --- */}
      <header
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
          isFloating
            ? 'bg-white/90 backdrop-blur-sm shadow-lg rounded-full max-w-screen-md' // Floating pill style
            : 'bg-transparent shadow-none w-full max-w-screen-lg' // Initial transparent style
        }`}
      >
        <nav className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a href="#" className="flex items-center gap-2 text-2xl font-bold text-gray-900">
              <PawPrint className="text-amber-500 h-7 w-7" />
              <span className={isFloating ? 'text-xl' : 'text-2xl'}>Snuffle</span>
            </a>
            
            {/* Navigation Links (hidden on small screens) */}
            <div className="hidden md:flex items-center space-x-8 px-8">
              <a href="#" className="text-gray-700 hover:text-amber-600 transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-amber-600 transition-colors">Pet Listings</a>
              <a href="#" className="text-gray-700 hover:text-amber-600 transition-colors">Contact us</a>
            </div>
            
            {/* Sign In Button */}
            <a 
              href="#" 
              className={`text-white bg-amber-500 hover:bg-amber-600 font-medium rounded-full text-sm transition-all duration-300 ${
                isFloating ? 'px-5 py-2' : 'px-6 py-3' // Button shrinks with nav
              }`}
            >
              Sign In
            </a>
          </div>
        </nav>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main>
        {/* --- Hero Section --- */}
        <section className="min-h-screen flex items-center pt-24 pb-12">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Find Your New<br />
                <span className="text-amber-500">Best Friend</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto md:mx-0">
                Discover loving pets from shelters near you. Join us in making adoption the first choice and find a companion who's waiting for a forever home.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center gap-2 bg-amber-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-amber-600 transition-colors duration-300 shadow-lg"
              >
                <Search className="h-5 w-5" />
                Browse Pets
              </a>
            </div>
            
            {/* Hero Image */}
            <div className="flex justify-center">
              <img 
                src="https://placehold.co/600x600/f8b400/ffffff?text=Happy+Adopted+Dog" 
                alt="Happy adopted dog"
                className="rounded-3xl shadow-2xl w-full max-w-md"
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
              {/* Pet Card 1 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img src="https://placehold.co/300x300/f8b400/ffffff?text=Buddy" alt="Dog" className="w-full h-48 object-cover"/>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">Buddy</h3>
                  <p className="text-gray-600 text-sm">2-year-old Golden Retriever</p>
                </div>
              </div>
              {/* Pet Card 2 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img src="https://placehold.co/300x300/a3e635/ffffff?text=Whiskers" alt="Cat" className="w-full h-48 object-cover"/>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">Whiskers</h3>
                  <p className="text-gray-600 text-sm">1-year-old Siamese</p>
                </div>
              </div>
              {/* Pet Card 3 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img src="https://placehold.co/300x300/f59e0b/ffffff?text=Rocky" alt="Dog" className="w-full h-48 object-cover"/>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">Rocky</h3>
                  <p className="text-gray-600 text-sm">3-year-old German Shepherd</p>
                </div>
              </div>
              {/* Pet Card 4 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img src="https://placehold.co/300x300/84cc16/ffffff?text=Mochi" alt="Cat" className="w-full h-48 object-cover"/>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">Mochi</h3>
                  <p className="text-gray-600 text-sm">5-year-old Domestic Shorthair</p>
                </div>
              </div>
            </div>
            {/* See All Button */}
            <a 
              href="#" 
              className="inline-flex items-center gap-2 mt-12 bg-white text-amber-600 font-bold py-3 px-6 rounded-full text-lg hover:bg-gray-100 transition-colors duration-300 border border-amber-500 shadow-sm"
            >
              See All Pets
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-6 text-center">
          <a href="#" className="flex justify-center items-center gap-2 text-2xl font-bold text-white mb-4">
            <PawPrint className="text-amber-500 h-7 w-7" />
            Snuffle
          </a>
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
  );
}

export default App;