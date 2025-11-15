# 🐾 Snuffle

Snuffle is a modern, full-stack platform designed to connect pet rehomers (shelters and rescues) with potential adopters. It's built with a secure, role-based React frontend, a Node.js backend API, and features a separate Python microservice for AI-powered pet breed identification.

## Key Features

  * **Dual-Role User System:** Users can sign up as either a "Customer" (Adopter) or a "Rehomer" (Shelter/Store).
  * **Legal Verification:** Rehomers would need to upload the Animal Welfare Board registration certificate of their store/rescue shelter when they sign up for legality of selling or fostering pets.
  * **Role-Based Permissions:** The UI and API adapt to the user's role. Rehomers can add pets, while Customers can apply to adopt them.
  * **Full CRUD Operations:** Rehomers have a "My Listings" page to **C**reate, **R**ead, **U**pdate, and **D**elete their pet listings.
  * **Complete Adoption Workflow:**
      * Customers fill out a detailed adoption application form and upload a valid proof of residence.
      * They can check the "My Applications" page to track the status (Pending, Approved, Rejected) of their applications.
      * Rehomers have an "Adoption Requests" page to review all applications and approve or reject them.
      * Rehomers cannot seek to adopt pets on our platform, to safeguard animals from re-sale and breeding abuse.
  * **Permanent Cloud Storage:** All user-uploaded images (pets, certificates, IDs) are saved to Cloudinary for persistent, fast-loading storage.
  * **AI Pet Scanner:** A "Pet Scanner" feature allows any logged-in user to upload a picture of a pet and get a real-time breed prediction from a Keras/TensorFlow model.
  * **User Friendly:** Intuitive UI for easy navigation.
-----

## Tech Stack

This project runs as a **microservice architecture** with three separate servers.

### 1\. Frontend (Vite + React)

  * **Framework:** React 19
  * **Build Tool:** Vite
  * **Styling:** Tailwind CSS
  * **Authentication:** Clerk (user management, and session tokens)
  * **Routing:** React Router v7
  * **UI:** Headless UI & Lucide Icons

### 2\. Backend (Node.js API)

  * **Runtime:** Node.js
  * **Framework:** Express
  * **Database:** MongoDB with Mongoose (for Pets and Applications)
  * **Authentication:** Clerk (backend SDK for validating user tokens and roles)
  * **File Storage:** Cloudinary (via `multer` and `multer-storage-cloudinary`)

### 3\. ML Microservice (Python)

  * **Framework:** Flask
  * **ML Library:** TensorFlow / Keras
  * **Model:** Pre-trained InceptionV3 model for dog breed classification.

-----

## Getting Started

To run this project locally, you must run all three servers simultaneously.

### 0. Clone the Repository

```bash
git clone https://github.com/siddhantv1/snuffle.git
cd snuffle
```


### 1\. Environment Variables

You will need environment variables from three different sources.

**A. Frontend (Root Folder): `.env.local`**

```env
# Get this from your Clerk Dashboard -> API Keys
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Clerk redirect routes
VITE_CLERK_AFTER_SIGN_IN_URL=/petlistings
VITE_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

**B. Backend (`/backend` folder): `.env`**

```env
# Get this from MongoDB Atlas -> Connect -> Drivers
MONGO_URI=mongodb+srv://...

# Get this from Clerk Dashboard -> API Keys
CLERK_SECRET_KEY=sk_test_...

# Get these from your Cloudinary Dashboard
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**C. ML Server (`/ml-server` folder):**

  * No `.env` file needed, but you **must** place your trained model and class names file in this folder:
      * `dog_breed_classifier_inceptionv3_v1.keras`
      * `class_names.json` (the 120-breed list generated from `Snuffle.ipynb`)

-----

### 2\. Running the Application

Open **three** separate terminals.

**Terminal 1: Start the Frontend (Vite)**

```bash
# In the root 'snuffle' folder
npm install
npm run dev
# App will be running at http://localhost:5173
```

**Terminal 2: Start the Backend (Node.js)**

```bash
# In the 'snuffle/backend' folder
cd backend
npm install
node server.js
# API will be running at http://localhost:5001
```

**Terminal 3: Start the ML Server (Flask)**

```bash
# In the 'snuffle/ml-server' folder
cd ml-server
python3 -m venv venv
source venv/bin/activate  # (or .\venv\Scripts\activate on Windows)
pip install -r requirements.txt
flask run
# ML service will be running at default PORT http://localhost:5000
```

Once all three servers are running, you can access the application at `http://localhost:5173`.


## Extra notes
In case you need to clean the database from orphaned data or repopulate it with sample data easily, follow these instructions.

### Cleaning the Database:
```bash
# navigate to /backend directory
cd backend

# run script (clean.js)
npm run clean

```

### Repopulating the Database:

```bash
cd backend
# runs seed.js, sample data is stored at  /src/data/petsdata.js
npm run seed

```