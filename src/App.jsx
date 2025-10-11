
import './App.css'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-800">
              Snuffle
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-800">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Find a Pet</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">About Us</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Contact</a>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Find Your New Best Friend</h1>
        <p className="text-xl text-gray-600 mb-8">Browse our available pets and find the perfect companion to bring home.</p>
        <a href="#" className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-600">
          See Available Pets
        </a>
      </main>

      <footer className="bg-white mt-16 py-8">
        <div className="container mx-auto px-6 text-center text-gray-600">
          &copy; 2025 Snuffle. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App
