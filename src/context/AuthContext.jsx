"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import axios from "axios";
import { auth, googleProvider } from "../../lib/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveUserToDb = async (firebaseUser) => {
    const userData = {
      name: firebaseUser.displayName,
      email: firebaseUser.email,
      img: firebaseUser.photoURL,
      firebase_uid: firebaseUser.uid,
    };
    try {
      const res = await axios.post("/api/user", userData);
      setUser(res.data.user || { ...userData, role: "student" });
    } catch (error) {
      console.error(error);
    }
  };

  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await saveUserToDb(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);