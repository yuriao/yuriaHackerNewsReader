import { getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";

// Call this function on page load when the user is redirected back to your site
export function handleRedirect() {
  if (!isFirebaseConfigured || !auth) {
    console.log("Firebase not configured. Cannot handle redirect.");
    return;
  }

  try {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // This gives you a Google Access Token. You can use it to access Google APIs.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;

          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          console.log("User signed in:", user.displayName);
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData?.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.error("Sign-in error:", errorMessage);
      });
  } catch (error) {
    console.error("Error handling redirect:", error);
  }
}