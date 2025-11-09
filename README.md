# Snuffle: Your Trusted Platform for Ethical Pet Adoption

Snuffle is a pet adoption platform built with React + Vite on the frontend and a Node/Express backend. The app uses Clerk for authentication and supports a first-time onboarding flow where users set their role and location.

This README explains how to run the project locally, what environment variables are required, and where key behaviors (auth + onboarding) are implemented.

## Table of contents
- Project highlights
- Requirements
- Local setup
- Environment variables
- Running the app
- Key files & architecture
- Onboarding & Clerk notes
- Troubleshooting
- Next steps / improvements

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Clerk for auth
- Backend: Node, Express
- Cloud Storage: Cloudinary
- Database: MongoDB Atlas

## Requirements
- Node.js (v16+ recommended)
- npm or yarn

## Local setup
1. Clone the repository
```
	git clone https://github.com/siddhantv1/snuffle.git
	cd Snuffle
```
2. Install dependencies
```
	npm install
	cd backend
	npm install
```
3. Create environment variables

	Copy or create `.env.local` in the project root for the frontend and set the Clerk publishable key. The repo includes an example `.env.local` entry (seen in development), but you should set your own keys from Clerk.

	- Frontend `.env.local` (root):
	  VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
	  VITE_CLERK_AFTER_SIGN_UP_URL=/onboarding

	- Backend `backend/.env`:
	  CLERK_SECRET_KEY=sk_test_...
	  CLOUDINARY_URL=... 

	Note: You can obtain keys from the Clerk dashboard. For local development use your Clerk test keys.

## Seed The Database
You need to seed the database by repopulating database with sample entries.
```
npm run seed
```

## Running the app
1. Start the backend (from `backend/`):
```
	cd backend
	node server
```
	The backend runs on port 5001 by default and exposes endpoints like `/api/pets` and `/api/pets` POST for creating pets (protected by Clerk middleware).

2. Start the frontend (from project root):
```
	npm run dev
```
	The frontend uses Vite and runs on port 5173 (default). Open http://localhost:5173

## Key files & architecture
- `src/main.jsx` — app bootstrap, wraps `App` with `BrowserRouter` and `ClerkProvider`.
- `src/App.jsx` — main layout, routes, public & protected routes and Clerk `SignIn`/`SignUp` routes.
- `src/components/ProtectedRoute.jsx` — shows sign-in modal for unauthenticated users and protects pages; used to gate `PetListings`, `PetDetails`, and `Onboarding`.
- `src/pages/Onboarding.jsx` — collects simple onboarding info (role, location) and saves it to Clerk's metadata.
- `backend/server.js` — Express server with Clerk middleware protecting certain routes.

## Onboarding & Clerk notes
- The app uses Clerk for auth. Make sure you set `VITE_CLERK_PUBLISHABLE_KEY` (frontend) and `CLERK_SECRET_KEY` (backend).
- To ensure client-side redirects (so after sign-up Clerk redirects to `/onboarding` without a full page reload), the `ClerkProvider` should be passed React Router's `navigate` function. Check `src/main.jsx` for a wrapper that passes the `navigate` prop into `ClerkProvider`.
- The app stores onboarding data using `user.update({ unsafeMetadata: { role, location } })` in `Onboarding.jsx`. The `ProtectedRoute` can (and should) check these fields and redirect users who haven't completed onboarding to `/onboarding`.

## Troubleshooting
- If users are redirected to `/` after sign-up instead of `/onboarding`:
  - Ensure `ClerkProvider` receives a navigate function from React Router (see `main.jsx`).
  - Confirm `VITE_CLERK_AFTER_SIGN_UP_URL` is set to `/onboarding` (or set the dashboard redirect) and that Clerk initialization is successful.
  - Check browser console/network for any Clerk initialization errors.

- If `user.update` in `Onboarding.jsx` fails:
  - Ensure your Clerk keys are correct and the backend is configured properly.
  - Inspect network requests and the console for errors.