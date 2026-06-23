import { NextResponse } from "next/server";
import { getPopularMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;

  try {
    const data = await getPopularMovies(page);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to load popular movies." },
      { status: 502 },
    );
  }
}
