"use client";

import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, use, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { FirestoreUser } from "../interfaces/firestoreUser";
import { useLocalStorage } from "../hooks/localStorage";
import { usePathname, useRouter } from "next/navigation";

const AuthContext = createContext({} as any);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const { get, set, remove } = useLocalStorage();
  const router = useRouter();
  const pathname = usePathname();

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUser(auth.currentUser);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Reference to the 'users' collection
      const usersCollection = collection(db, "users");
      // Create a new document in the 'users' collection
      const userDoc = doc(usersCollection, auth.currentUser?.uid);
      // Set user details in the document
      await setDoc(userDoc, {
        admin: false,
        age: 0,
        email,
        name,
        gender: 0,
        height: 0,
        weight: 0,
        bmi: 0,
      });

      setUser(auth.currentUser);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      remove("userId");
      router.push("/credentials");
    } catch (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser !== null) {
        setUser(currentUser);
        set("userId", currentUser.uid);
      } else if (pathname == "/") {
        return;
      } else {
        router.push("/credentials");
      }
    });
    return () => unsubscribe();
  }, [user, router, set, pathname]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const retrievedUid = (await get("userId")) || auth.currentUser?.uid;
      if (!retrievedUid) return;

      const userDocRef = doc(db, "users", retrievedUid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const retrievedUserData = await userDocSnapshot.data();
        setUserData(retrievedUserData as FirestoreUser);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, signIn, signUp, logout, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
