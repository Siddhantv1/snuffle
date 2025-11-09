import mongoose from 'mongoose';
const { Schema } = mongoose; // Use object destructuring

const PetSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  size: { type: String },
  location: { type: String },
  image: { type: String },
  description: { type: String },
  rehomerId: { type: String, required: true }, //linking the pet to creator
}, { timestamps: true });

export default mongoose.model('Pet', PetSchema); 