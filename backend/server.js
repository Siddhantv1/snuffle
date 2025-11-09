// server.js (ES Module Version)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config'; // New way to import dotenv

import { clerkAuth } from './clerk.js'; // Use import, add .js
import Pet from './models/Pet.js';     // Use import, add .js
import { upload } from './cloudinary.js';

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
// 'upload.single' tells multer to look for a file named "image"
app.post('/api/pets', clerkAuth, upload.single('image'), async (req, res) => {
  try {
    const { userId } = req.auth;
    
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

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});