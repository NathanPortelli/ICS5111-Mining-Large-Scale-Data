import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";

export async function GET() {
  const querySnapshot = await getDocs(collection(db, "food"));
  return NextResponse.json({
    result: querySnapshot.docs.map((doc) => doc.data()),
  });
}
