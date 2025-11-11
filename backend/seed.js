import mongoose from 'mongoose';
import 'dotenv/config';
import Pet from './models/Pet.js'; // Import our Pet model
import allPets from '../src/data/petsdata.js'; // Import the static pet data


const YOUR_USER_ID = 'user_35FCYjxhvorDWUdC6mXJ54AL28v'; 
// ---------------------------------

if (!YOUR_USER_ID.startsWith('user_')) {
  console.error('ERROR: Please paste your Clerk User ID into the YOUR_USER_ID variable.');
  process.exit(1);
}

// Add the required 'rehomerId' to all pets
const petsToSeed = allPets.map(pet => ({
  ...pet,
  rehomerId: YOUR_USER_ID,
}));

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    // Clear the existing Pet collection
    console.log('Clearing Pet collection...');
    await Pet.deleteMany({});
    
    // Insert the new pets
    console.log('Adding seed data...');
    await Pet.insertMany(petsToSeed);
    
    console.log('✅ Database seeded successfully!');
    
  } catch (err) {
    console.error('Error seeding database:', err.message);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedDatabase();