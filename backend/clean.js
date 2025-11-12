import mongoose from 'mongoose';
import 'dotenv/config';
import Pet from './models/Pet.js';
import AdoptionApplication from './models/AdoptionApplication.js';

const cleanupOrphanedApplications = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    // 1. Get a list of all pet IDs that *still exist*
    const existingPetIds = await Pet.find().distinct('_id');
    
    // 2. Find all applications whose 'pet' field is NOT IN ($nin) the list of existing IDs
    console.log('Finding orphaned applications...');
    const query = { pet: { $nin: existingPetIds } };
    const orphans = await AdoptionApplication.find(query);

    if (orphans.length === 0) {
      console.log('✅ No orphaned applications found. Your database is clean!');
      await mongoose.disconnect();
      return;
    }

    console.log(`Found ${orphans.length} orphaned application(s). Deleting...`);

    // 3. Delete them
    const deleteResult = await AdoptionApplication.deleteMany(query);
    
    console.log(`✅ Successfully deleted ${deleteResult.deletedCount} application(s).`);

  } catch (err) {
    console.error('Error during cleanup:', err.message);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

cleanupOrphanedApplications();