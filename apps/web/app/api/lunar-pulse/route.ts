import { NextResponse } from "next/server";

export async function GET() {
  try {
    const astroServiceUrl = process.env.ASTRO_SERVICE_URL || "http://localhost:8000";
    const response = await fetch(`${astroServiceUrl}/moon-phases`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Astro service returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching moon phases:", error);
    return NextResponse.json(
      { error: "Failed to fetch lunar data" },
      { status: 500 }
    );
  }
}
