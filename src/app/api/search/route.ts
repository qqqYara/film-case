import { NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const page = Number(searchParams.get("page")) || 1;

  if (!query) {
    return NextResponse.json({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    });
  }

  try {
    const data = await searchMovies(query, page);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to search movies." },
      { status: 502 },
    );
  }
}
