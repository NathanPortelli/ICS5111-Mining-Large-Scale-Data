import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { firestoreDb } from "@/app/firebase";

export async function GET() {
  const querySnapshot = await getDocs(collection(firestoreDb, "food"));
  return NextResponse.json({
    result: querySnapshot.docs.map((doc) => doc.data()),
  });
}
