// server.js (ES Module Version)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config'; // New way to import dotenv

import { clerkAuth } from './clerk.js'; 
import Pet from './models/Pet.js';     
import { uploadPetImage, uploadCertificate, uploadIdProof } from './cloudinary.js';
import { ClerkExpressRequireAuth, clerkClient } from '@clerk/clerk-sdk-node';
import AdoptionApplication from './models/AdoptionApplication.js'

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API ROUTES ---

// GET: Get all pets (PUBLIC)
app.get('/api/pets', async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
});

// -- NEW "MY-LISTINGS" ROute for rehomers --
app.get('/api/pets/my-listings', clerkAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const pets = await Pet.find({ rehomerId: userId }).sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    console.error('My Listings error:', err);
    res.status(500).json({ error: 'Failed to fetch your listings.' });
  }
});


// -- GET PET AS THE REHOMER -- 
// This route is protected so only the owner can see the edit page
app.get('/api/pets/:id', clerkAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found.' });
    }

    // Security check: Is this user the owner?
    if (pet.rehomerId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this pet.' });
    }

    res.json(pet);
  } catch (err) {
    console.error('Get pet error:', err);
    res.status(500).json({ error: 'Failed to fetch pet.' });
  }
});

// --- THE "ADD PET" ROUTE ---
// We add 'clerkAuth' first, then 'upload.single('image')'
// 'uploadPetImage.single' tells multer to look for a file named "image"
app.post('/api/pets', clerkAuth, uploadPetImage.single('image'), async (req, res) => {
  try {
    const { userId } = req.auth;
    
    //check if uploader is of rehomer role or not
    const user = await clerkClient.users.getUser(userId);
    if (user.unsafeMetadata.role !== 'rehomer') {
      return res.status(403).json({ error: 'Only rehomers can add new pets.' });
    }
    
    //  The file URL is now at req.file.path
    //    The text fields are at req.body
    const newPet = new Pet({
      ...req.body,
      image: req.file.path, // <-- This is the new permanent URL from Cloudinary
      rehomerId: userId,
    });

    const savedPet = await newPet.save();
    res.status(201).json(savedPet);

  } catch (err) {
    console.error(err); // Log the full error
    res.status(400).json({ error: 'Failed to add pet', details: err.message });
  }
});

// UPDAET: Add the rehomer certificate upload for new onboarding route
app.post('/api/onboarding', clerkAuth, uploadCertificate.single('certificate'), async (req, res) => {
  try {
    const { userId } = req.auth;
    const { role, location, address } = req.body;

    let metadata = {
      role: role,
      location: location,
    };

    // If they are a rehomer, add the extra fields
    if (role === 'rehomer') {
      if (!req.file) {
        return res.status(400).json({ error: 'Certificate is required for rehomers.' });
      }
      metadata.address = address;
      metadata.certificateUrl = req.file.path; // Add certificate URL
    }

    // Use the backend clerkClient to securely update metadata
    // This is the correct way, as you found in the docs!
    await clerkClient.users.updateUserMetadata(userId, {
      unsafeMetadata: metadata, // We still use unsafeMetadata to read it easily on the client
    });

    res.status(200).json({ success: true, metadata: metadata });
  } catch (err) {
    console.error('Onboarding error:', err);
    res.status(500).json({ error: 'Failed to save onboarding data.' });
  }
});

// New POST ROUTE for listening to Applications
app.post('/api/applications', clerkAuth, uploadIdProof.single('idProof'), async (req, res) => {
  try {
    const { userId } = req.auth;
    const { 
      petId, rehomerId, fullName, age, householdSize, 
      contactNumber, address, residenceType, hasOtherPets, 
      hasKids, petSleepLocation, agreedToCare, agreedToBackgroundCheck 
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'ID Proof is required.' });
    }

    // Basic validation
    if (!agreedToCare || !agreedToBackgroundCheck) {
      return res.status(400).json({ error: 'You must agree to the terms.' });
    }

    const newApplication = new AdoptionApplication({
      applicantId: userId,
      pet: petId,
      rehomerId: rehomerId,
      fullName,
      age: Number(age),
      householdSize: Number(householdSize),
      contactNumber,
      address,
      residenceType,
      idProofUrl: req.file.path,
      hasOtherPets: hasOtherPets === 'true',
      hasKids: hasKids === 'true',
      petSleepLocation,
      agreedToCare: agreedToCare === 'true',
      agreedToBackgroundCheck: agreedToBackgroundCheck === 'true',
      status: 'Pending',
    });

    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);

  } catch (err) {
    console.error('Application submission error:', err);
    res.status(500).json({ error: 'Failed to submit application', details: err.message });
  }
});

// --- "DELETE PET" ROUTE ---
app.delete('/api/pets/:id', clerkAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    // Find the pet first to make sure the user owns it
    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found.' });
    }

    if (pet.rehomerId !== userId) {
      // This is not their pet!
      return res.status(403).json({ error: 'Forbidden: You do not own this pet.' });
    }

    // Okay, they own it so delete it.
    await Pet.findByIdAndDelete(id);
    
    // We should also delete all pending applications for this pet
    await AdoptionApplication.deleteMany({ pet: id });

    res.status(200).json({ success: true, message: 'Pet deleted successfully.' });

  } catch (err) {
    console.error('Delete pet error:', err);
    res.status(500).json({ error: 'Failed to delete pet.' });
  }
});


// --- REHOMER's "UPDATE PET" ROUTE ---
// We use PATCH because we're only partially updating.
// It also handles an optional new image upload.
app.patch('/api/pets/:id', clerkAuth, uploadPetImage.single('image'), async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    // Find the pet to ensure ownership
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found.' });
    }
    if (pet.rehomerId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this pet.' });
    }

    // Prepare the updates
    const updates = {
      ...req.body,
    };

    // If a new image was uploaded, add its path to the updates
    if (req.file) {
      updates.image = req.file.path;
      // Note: We're not deleting the old image from Cloudinary here
      // for simplicity, but a real app would do that.
    }

    // Find the pet by its ID and update it with the new data
    const updatedPet = await Pet.findByIdAndUpdate(
      id,
      updates,
      { new: true } // This option returns the updated document
    );

    res.status(200).json(updatedPet);
  } catch (err) {
    console.error('Update pet error:', err);
    res.status(500).json({ error: 'Failed to update pet.' });
  }
});


// new GET for "MY APPLICATIONS" ROuTE
app.get('/api/applications/my-applications', clerkAuth, async (req, res) => {
  try {
    const { userId } = req.auth;

    const applications = await AdoptionApplication.find({ applicantId: userId })
      .sort({ createdAt: -1 }) // Show newest first
      .populate('pet'); // <-- This is the magic! It fetches the pet data.

    res.json(applications);
  } catch (err) {
    console.error('My Applications error:', err);
    res.status(500).json({ error: 'Failed to fetch your applications.' });
  }
});

// --- 1. ADD NEW "RECEIVED REQUESTS" ROUTE (for Rehomers) ---
app.get('/api/applications/received', clerkAuth, async (req, res) => {
  try {
    const { userId } = req.auth;

    // Find all applications where the rehomerId matches the logged-in user
    const applications = await AdoptionApplication.find({ rehomerId: userId })
      .sort({ createdAt: -1 })
      .populate('pet'); // Get the pet info for each application

    res.json(applications);
  } catch (err) {
    console.error('Received Applications error:', err);
    res.status(500).json({ error: 'Failed to fetch received applications.' });
  }
});

// --- 2. ADD NEW "UPDATE STATUS" ROUTE (for Rehomers) ---
app.patch('/api/applications/:id/status', clerkAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params; // The ID of the application
    const { status } = req.body; // The new status ("Approved" or "Rejected")

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided.' });
    }

    // Find the application
    const application = await AdoptionApplication.findById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    // Security check: Make sure the logged-in user is the rehomer for this application
    if (application.rehomerId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You are not the rehomer for this application.' });
    }

    // Update the status
    application.status = status;
    const updatedApplication = await application.save();
    
    // We populate 'pet' on the returned object so the frontend can update
    await updatedApplication.populate('pet'); 

    res.status(200).json(updatedApplication);

  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Failed to update application status.' });
  }
});


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});