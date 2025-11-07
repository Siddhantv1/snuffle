import { useAuth, useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

 function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { openSignIn } = useClerk(); // default funct to open SignIn modal

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

  // 3. If the user is not signed in (and the modal is opening),
  // show nothing, or the loader again.
  return (
    <div className="flex justify-center items-center h-screen">
      <LoaderCircle className="animate-spin text-amber-500 " size={48} />
    </div>
  );
}

export default ProtectedRoute;