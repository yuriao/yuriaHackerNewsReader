import { auth, isFirebaseConfigured } from "./firebase";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

// Call this function when the user clicks on the "Login" button
export function login() {
  if (isFirebaseConfigured && auth) {
    try {
      const provider = new GoogleAuthProvider();
      signInWithRedirect(auth, provider)
        .catch((error) => {
          console.error("Login redirect error:", error);
        });
    } catch (error) {
      console.error("Login setup error:", error);
    }
  } else {
    console.log("Firebase not configured properly. Cannot login.");
  }
}