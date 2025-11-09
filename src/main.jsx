import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const FIRST_TIME_URL = import.meta.env.VITE_CLERK_AFTER_SIGN_UP_URL

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const clerkAppearance = {
  variables: {
    // This will change all buttons and links to your 'amber' color
    colorPrimary: '#f59e0b', 
    // This will change the card/modal background
    colorBackground: '#ffffff',
    // This will change the main text color
    colorText: '#1f2937', 
    // This will match your site's rounded corners
    borderRadius: '0.75rem', 
  },
  elements: {
    // This injects Tailwind classes directly
    card: 'shadow-xl', // Add your 'shadow-xl' to Clerk's card
    buttonPrimary: 'bg-amber-500 hover:bg-amber-600', // Match your site's buttons
    
    // You can style every single part
    // For example, to style the "Sign in with Google" button:
    socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-100' 
  }
};


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}
      appearance={clerkAppearance}
      signUpForceRedirectUrl={FIRST_TIME_URL}
      >
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
)