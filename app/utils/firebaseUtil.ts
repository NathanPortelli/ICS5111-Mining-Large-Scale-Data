import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function getAllData(collectionName: string) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const data = querySnapshot.docs.map((doc) => doc.data());

  return data;
}
