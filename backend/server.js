// server.js (ES Module Version)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config'; // New way to import dotenv

import { clerkAuth } from './clerk.js'; 
import Pet from './models/Pet.js';     
import { uploadPetImage, uploadCertificate } from './cloudinary.js';
import { ClerkExpressRequireAuth, clerkClient } from '@clerk/clerk-sdk-node';

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

// --- 2. UPDATE THE "ADD PET" ROUTE ---
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
    
    // 3. The file URL is now at req.file.path
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


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});