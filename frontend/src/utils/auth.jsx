import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "./api";
import {
  signInWithGoogle as firebaseSignInWithGoogle,
  signOut as firebaseSignOut,
  onAuthChange,
} from "./firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase
        try {
          // Sync Firebase user to backend database
          const response = await api.auth.syncFirebaseUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });

          // Store backend JWT token and user data
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          setUser(response.user);
        } catch (error) {
          console.error("Error syncing Firebase user:", error);
          // Fallback: use Firebase data only
          const userData = {
            id: firebaseUser.uid,
            username:
              firebaseUser.displayName || firebaseUser.email?.split("@")[0],
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            role: "user",
          };
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        }
      } else {
        // User is signed out
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (username, password) => {
    const response = await api.auth.login({ username, password });
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    setUser(response.user);
    return response;
  };

  const googleLogin = async () => {
    try {
      // Sign in with Firebase Google popup
      await firebaseSignInWithGoogle();
      // The onAuthChange listener will handle the rest
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    const response = await api.auth.register(userData);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut();
      // The onAuthChange listener will handle clearing localStorage
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: clear locally even if Firebase signout fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const value = {
    user,
    login,
    googleLogin,
    logout,
    register,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
