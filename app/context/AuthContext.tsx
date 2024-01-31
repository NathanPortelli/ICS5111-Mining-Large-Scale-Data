"use client";

import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { FirestoreUser } from "../interfaces/firestoreUser";
import { useLocalStorage } from "../hooks/localStorage";
import { usePathname, useRouter } from "next/navigation";

const AuthContext = createContext({} as any);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const { get, set } = useLocalStorage();
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

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setUser(auth.currentUser);
      return auth.currentUser;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser !== null) {
        setUser(currentUser);
        set("userId", currentUser.uid);
        fetchUserData();
      } else if (pathname == "/") {
        return;
      } else {
        router.push("/credentials");
      }
    });
    return () => unsubscribe();
  }, [user, router, set, pathname]);

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
    <AuthContext.Provider value={{ user, userData, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
