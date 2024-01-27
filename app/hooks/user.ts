import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { FirestoreUser } from "../interfaces/firestoreUser";
import { useLocalStorage } from "./localStorage";

export function useUser() {
  const { get } = useLocalStorage();
  const [user, setUser] = useState<FirestoreUser | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const retrievedUid = (await get("userId")) || auth.currentUser?.uid;
      if (!retrievedUid) return;

      setUid(retrievedUid);
      const userDocRef = doc(db, "users", retrievedUid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = await userDocSnapshot.data();
        setUser(userData as FirestoreUser);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return {
    user,
    uid,
  };
}
