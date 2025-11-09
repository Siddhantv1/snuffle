// server.js (ES Module Version)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config'; // New way to import dotenv

import { clerkAuth } from './clerk.js'; // Use import, add .js
import Pet from './models/Pet.js';     // Use import, add .js

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

// POST: Add a new pet (PROTECTED)
app.post('/api/pets', clerkAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    
    const newPet = new Pet({
      ...req.body,
      rehomerId: userId,
    });

    const savedPet = await newPet.save();
    res.status(201).json(savedPet);

  } catch (err) {
    res.status(400).json({ error: 'Failed to add pet', details: err.message });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});