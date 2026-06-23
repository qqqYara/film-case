import { NextResponse } from "next/server";
import { discoverSortBy } from "@/lib/sort";
import { discoverMoviesByGenre } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genreId = Number(searchParams.get("genre"));
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = discoverSortBy(searchParams.get("sort"));

  if (!genreId) {
    return NextResponse.json(
      { error: "Missing or invalid `genre` parameter." },
      { status: 400 },
    );
  }

  try {
    const data = await discoverMoviesByGenre(genreId, page, sortBy);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to load movies for this genre." },
      { status: 502 },
    );
  }
}
