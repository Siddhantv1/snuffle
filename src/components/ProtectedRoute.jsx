import { useAuth, useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";
import { LoaderCircle, Dog } from "lucide-react";
import { useNavigate } from "react-router-dom";

 function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { openSignIn } = useClerk(); // default funct to open SignIn modal
  const navigate = useNavigate();

  useEffect(() => {
    // This effect runs when Clerk is loaded and knows the user's status
    if (isLoaded && !isSignedIn) {
      // If the user is loaded but not signed in
      openSignIn();
    }
  }, [isLoaded, isSignedIn, openSignIn]);

  // 1. While Clerk is checking the user's status, show a loader
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  // 2. If the user is signed in, show the protected page content
  if (isSignedIn) {
    return children;
  }

  // 3. If loaded, but NOT signed in (the modal is open or was closed)
  // Instead of loader, show a fallback.
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50 p-4 text-center">
      <Dog className="animate-bounce text-amber-500 mb-6" size={48} />
      <h1 className="text-xl font-semibold text-gray-800 mb-2">
        Please Sign In to continue
      </h1>
      <p className="text-gray-600 mb-8 max-w-sm">
        Sign in or create an account to discover pet listings in your area, adopt pets, and identify animals.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/")} // Navigate to homepage
          className="px-5 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
        >
          Go Home
        </button>
        <button
          onClick={() => openSignIn()} // Re-open the modal
          className="px-5 py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors duration-200 cursor-pointer"
        >
          Sign-In
        </button>
      </div>
    </div>
  );
}

export default ProtectedRoute;