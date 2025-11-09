
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'snuffle-pets', // This will create a folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

export const uploadPetImage = multer({ storage: storage });

// Added storage for certificates.
const certificateStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'snuffle-certificates', // Store in a separate folder
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // Allow PDFs
  },
});
export const uploadCertificate = multer({ storage: certificateStorage });


// For adopter ID proofs
const idProofStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'snuffle-id-proofs',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
  },
});
export const uploadIdProof = multer({ storage: idProofStorage });