import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url!);
    const food = url.searchParams.get("food");
    const res = await fetch(
      process.env.MYFITNESSPAL_BASE_URL + `/nutrition?query=${food}&page=1`
    );
    const data = await res.json();

    return Response.json(data);
  } catch (err) {
    return Response.json({
      result: err,
    });
  }
}
