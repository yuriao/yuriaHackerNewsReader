import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, isFirebaseConfigured } from './firebase';
import { GoogleAuthProvider, signInWithRedirect, signOut, onAuthStateChanged, User as FirebaseUser, Auth } from 'firebase/auth';
import { handleRedirect } from './handleRedirect';

// Basic user interface
interface User {
  id: number;
  displayName: string;
  isAnonymous: boolean;
  uid?: string; // Firebase UID
  email?: string;
  photoURL?: string;
}

// Create a fallback user for when Firebase is not configured
const FALLBACK_USER: User = {
  id: 1,
  displayName: 'Guest User',
  isAnonymous: true,
};

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// Convert Firebase user to our app user
const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;
  
  return {
    id: parseInt(firebaseUser.uid.substring(0, 8), 16) || 1, // Generate a numeric ID from UID
    displayName: firebaseUser.displayName || 'User',
    isAnonymous: firebaseUser.isAnonymous,
    uid: firebaseUser.uid,
    email: firebaseUser.email || undefined,
    photoURL: firebaseUser.photoURL || undefined
  };
};

// Provider component that wraps the app and makes auth object available
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  
  // Check if Firebase is configured and handle redirects
  useEffect(() => {
    if (isFirebaseConfigured) {
      // Try to handle any pending redirects
      handleRedirect();
    } else {
      console.log('Firebase not configured, using fallback user');
      setUser(FALLBACK_USER);
      setInitializing(false);
    }
  }, []);
  
  // Setup auth state listener
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(mapFirebaseUserToAppUser(firebaseUser));
      setInitializing(false);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);
  
  // Firebase login with Google
  const login = () => {
    if (isFirebaseConfigured && auth) {
      try {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider).catch(error => {
          console.error('Login error:', error);
        });
      } catch (error) {
        console.error('Login setup error:', error);
        // Fallback to mock user on error
        setUser(FALLBACK_USER);
      }
    } else {
      // Use fallback when Firebase not available
      setUser(FALLBACK_USER);
    }
  };
  
  // Firebase logout
  const logout = () => {
    if (isFirebaseConfigured && auth) {
      signOut(auth).catch(error => {
        console.error('Logout error:', error);
      });
    } else {
      setUser(null);
    }
  };
  
  // Value object that will be shared
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };
  
  if (initializing) {
    // Could return a loading state here
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for components to get the auth object and re-render when it changes
export const useAuth = () => useContext(AuthContext);

// Convenience hook to get just the user
export const useUser = () => {
  const { user } = useAuth();
  return user;
};