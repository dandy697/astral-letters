import { NextResponse } from "next/server";
import { calculateChart } from "@/lib/astro";
import { intakeSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const input = intakeSchema.parse(await request.json());
    const chart = await calculateChart(input);
    return NextResponse.json(chart);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Astro chart unavailable" }, { status: 400 });
  }
}
