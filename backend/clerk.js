import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
// import { configDotenv } from 'dotenv';
import 'dotenv/config';
// const app = configDotenv();
// This middleware will check the Authorization header for a valid JWT
export const clerkAuth = ClerkExpressRequireAuth({ // Use 'export'
  secretKey: process.env.CLERK_SECRET_KEY,
});