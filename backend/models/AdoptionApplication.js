import mongoose from 'mongoose';
const { Schema } = mongoose;

const AdoptionApplicationSchema = new Schema({
  // --- Who is applying? ---
  applicantId: { type: String, required: true }, // Clerk User ID
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  residenceType: { type: String, required: true, enum: ['Hostel', 'House', 'Flat'] },
  idProofUrl: { type: String, required: true }, // Link from Cloudinary

  // --- Household Info ---
  householdSize: { type: Number, required: true },
  hasOtherPets: { type: Boolean, default: false },
  hasKids: { type: Boolean, default: false },
  petSleepLocation: { type: String, required: true, enum: ['Indoors', 'Outdoors'] },
  
  // --- Pet Info ---
  pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
  rehomerId: { type: String, required: true }, // Clerk User ID of the pet's owner

  // --- Agreements ---
  agreedToCare: { type: Boolean, required: true },
  agreedToBackgroundCheck: { type: Boolean, required: true },

  // --- Status (for the rehomer to manage) ---
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] }

}, { timestamps: true });

export default mongoose.model('AdoptionApplication', AdoptionApplicationSchema);