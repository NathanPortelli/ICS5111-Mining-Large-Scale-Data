import { NextResponse } from "next/server";

export async function GET() {
  
  return NextResponse.json({ hello: process.env.MYFITNESSPAL_BASE_URL });
}