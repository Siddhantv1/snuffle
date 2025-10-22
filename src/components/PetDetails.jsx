import React from 'react';
import { ArrowLeft, Cake, Users, Ruler, MapPin, Heart } from 'lucide-react';
import allPets from '../data/petsdata.js';
import { useNavigate, useParams } from 'react-router-dom';


// This is a small helper component just for this page
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="bg-amber-100 text-amber-600 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const pet = allPets.find(p=>p.id.toString()==id);
  if (!pet){
    return (
        <div className='text-center p-10'>
            <h2 className='text-2xl text-gray-700'>Pet Not Found</h2>
            <button onClick={() => navigate('/')} className='cursor-pointer mt-4 bg-amber-500 text-white px-4 py-2 rounded-lg'>Back to listings</button>
        </div>
    );
  }

  return (
<div className="bg-amber-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer inline-flex items-center gap-2 text-amber-600 font-bold mb-6 group"
        >
          <ArrowLeft size={20} className="cursor-pointer transition-transform group-hover:-translate-x-1" />
          Back to Listings
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-full min-h-[300px] md:h-full object-cover rounded-xl shadow-lg"
              />
            </div>

            <div className="p-6 md:p-10 flex flex-col">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{pet.name}</h1>
              <p className="text-xl text-gray-600 mb-6 font-medium">{pet.breed}</p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-8">
                <InfoItem icon={<Cake size={20} />} label="Age" value={`${pet.age} years old`} />
                <InfoItem icon={<Users size={20} />} label="Gender" value={pet.gender} />
                <InfoItem icon={<Ruler size={20} />} label="Size" value={pet.size} />
                <InfoItem icon={<MapPin size={20} />} label="Location" value={pet.location} />
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 mb-3">About {pet.name}</h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-10 flex-grow">
                {pet.description}
              </p>

              <button className="cursor-pointer w-full flex justify-center items-center gap-3 bg-amber-500 text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-amber-600 transition-colors duration-300 shadow-lg">
                <Heart size={22} />
                Start Adoption Process
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}