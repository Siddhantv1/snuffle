import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFloating(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-gray-500 min-h-screen font-sans">
      <header
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
          isFloating
            ? 'bg-white shadow-lg rounded-xl px-6 py-3 max-w-screen-md'
            : 'bg-white shadow-none px-8 py-5 rounded-xl w-full max-w-screen-l justify-auto'
        }`}
      >
        <nav className="container mx-auto">
          <div className="flex items-center justify-center">
            <div className="text-2xl font-bold text-gray-900">
              Snuffle
            </div>
            <div className="flex space-x-10 px-8">
              <a href="#" className="text-gray-600 hover:text-gray-800 py-2">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-800 py-2">Pet Listings</a>
              <a href="#" className="text-gray-600 hover:text-gray-800 py-2">Contact us</a>
              <a href="#" className="text-gray-100 bg-sky-800 rounded px-2 py-2">Sign In</a>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-32 container mx-auto px-6 text-center">
        <section className="mb-20">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Find Your New Best Friend</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Discover loving pets looking for forever homes. Join us in making adoption the first choice.</p>
          <a href="#" className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-600">
            Browse Pets
          </a>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Why Adopt?</h2>
            <p className="text-gray-600">Give a second chance to animals in need and help reduce pet overpopulation.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Adoption Process</h2>
            <p className="text-gray-600">Simple steps to bring home your companion. We guide you through every stage.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Volunteer</h2>
            <p className="text-gray-600">Help us care for the animals and make a difference in your community.</p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Pets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <img src="https://place-puppy.com/300x200" alt="Dog" className="w-full h-48 object-cover"/>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">Buddy</h3>
                <p className="text-gray-600 text-sm">2-year-old Labrador Retriever</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <img src="https://placekitten.com/300/200" alt="Cat" className="w-full h-48 object-cover"/>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">Whiskers</h3>
                <p className="text-gray-600 text-sm">1-year-old Tabby Cat</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <img src="https://place-puppy.com/301x200" alt="Dog" className="w-full h-48 object-cover"/>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">Luna</h3>
                <p className="text-gray-600 text-sm">3-year-old German Shepherd</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <img src="https://placekitten.com/301/200" alt="Cat" className="w-full h-48 object-cover"/>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">Milo</h3>
                <p className="text-gray-600 text-sm">4-month-old Siamese Kitten</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-8">
        <div className="container mx-auto px-6 text-center text-gray-600">
          &copy; 2025 Snuffle. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
